# Timezone Setting Fix Documentation

## Issue Description

Users encountered a PHP error when selecting "GMT+2" from the timezone dropdown in Minera settings:

```
Message: date_default_timezone_set(): Timezone ID 'GMT+2' is invalid
```

## Root Cause

The timezone configuration file (`application/config/timezones.php`) contained invalid timezone identifiers like "GMT+2", "GMT+1", etc. These are not valid PHP timezone identifiers according to the IANA timezone database.

PHP's `date_default_timezone_set()` function only accepts valid timezone identifiers and generates a notice when given invalid ones.

## Solution Implemented

### 1. Added Timezone Validation Function

Created `_validateAndNormalizeTimezone()` function in the App controller that:
- Checks if timezone is already valid
- Maps invalid GMT+/-X formats to valid geographical timezones  
- Returns false for unmappable invalid timezones

### 2. GMT Offset Mappings

Invalid GMT offsets are mapped to meaningful geographical timezones:

```php
'GMT+2' => 'Europe/Athens',     // Eastern European Time
'GMT+1' => 'Europe/Berlin',     // Central European Time  
'GMT-5' => 'America/New_York',  // Eastern Standard Time
'GMT-8' => 'America/Los_Angeles', // Pacific Standard Time
// ... etc
```

### 3. Controller Integration

#### Constructor (lines 5-18)
- Validates stored timezone on application startup
- Normalizes invalid stored timezones automatically
- Falls back to UTC if validation fails

#### Settings Save Method (lines 651-669)
- Validates user input before calling `date_default_timezone_set()`
- Shows user-friendly error messages for invalid timezones
- Stores normalized timezone identifiers

### 4. Error Handling

- Invalid timezones with mappings are silently converted
- Invalid timezones without mappings show error messages
- No PHP notices or warnings are generated
- Graceful fallback behavior ensures application stability

## Testing Results

| Input | Output | Result |
|-------|--------|---------|
| GMT+2 | Europe/Athens | ✅ Success |
| GMT-5 | America/New_York | ✅ Success |
| Europe/Berlin | Europe/Berlin | ✅ Unchanged |
| InvalidTZ | Error message | ✅ Handled |

## Benefits

1. **Eliminates PHP errors** - No more timezone notices
2. **Maintains user experience** - GMT+2 still works as expected
3. **Improves usability** - Geographical timezone names are more meaningful
4. **Backward compatibility** - Existing valid timezones unchanged
5. **Robust error handling** - Graceful handling of edge cases

## Files Modified

- `application/controllers/app.php` - Added validation function and integrated it into timezone setting logic

## No Breaking Changes

This fix is completely backward compatible:
- Valid timezones continue to work unchanged
- Invalid timezones are silently improved where possible
- Only enhancement is better error handling for truly invalid inputs

## Future Considerations

The timezone configuration file could be updated to replace all invalid GMT+/-X entries with their valid geographical equivalents, but this is not necessary since the validation function handles the conversion automatically.