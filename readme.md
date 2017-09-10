# js-sdk-calendar

Simple calendar utilities.

## library

```ts
$ isFirstWeek(date : Date) -> Boolean

// true if it is in first week.


$ isLastWeek(date : Date) -> Boolean

// true if it is in last week.


$ monthRange(s : Number, e : Number, f : Number -> b) -> [b]

// Returns a range of days from 's' start and 'e' end.
// For each day apply function 'f'.
//
// Note: 's' and 'e' are not checked if they are actually in the month.
// Use `rangeInMonth` to validate those values.


$ rangeInMonth(d : Date, s : Number, e : Number, f : Number -> b) -> [b]

// Returns a range of days from 's' start and 'e' end.
// Use date 'd' to check if 'e' don't pass the last day of the month,
// if it does, return the last day.


$ beginOfMonth(d : Date) -> Date

// Returns the first day as 'Date' using date 'd'.


$ endOfMonth(d : Date) -> Date

// Returns the last day as 'Date' using date 'd'.


$ beginOfDay(d : Date) -> Date

// Returns the begin of day as 'Date' using date 'd'.


$ endOfDay(d : Date) -> Date

// Returns the end of day as 'Date' using date 'd'.


$ beginOfNextMonth(d : Date) -> Date

// Returns the first day of the next month of 'd' as 'Date'.


$ endOfPreviosMonth(d : Date) -> Date

// Returns the last day of the previous month of 'd' as 'Date'.


$ firstWeekOfMonth(d : Date, f : Number -> b) -> [b]

// Returns an 'Array' of days of the first week of 'd'.
// For each day apply function 'f'.


$ firstWeekOfNextMonth(d : Date, f : Number -> b) -> [b]

// Returns an 'Array' of days of the first week of the next month of 'd'.
// For each day apply function 'f'.


$ lastWeekOfMonth(d : Date, f : Number -> b) -> [b]

// Returns an 'Array' of days of the last week of 'd'.
// For each day apply function 'f'.


$ lastWeekOfPreviousMonth(d : Date, f : Number -> b) -> [b]

// Returns an 'Array' of days of the last week of the previous month of 'd'.
// For each day apply function 'f'.


$ weekImpl(d : Date, f : Number -> b) -> [b]

// Generic version of the function to generate a week calendar.
//
// Note: Blank spaces of the 'Array' are all 'null' and 'f' is not applied
// to them.


$ week(d : Date) -> [Number]

// Generate a list of days from the week of date.

= week(new Date(2017, 0, 1)) == weekImpl(new Date(2017, 0, 1), identity)


$ weekCImpl(d : Date, f : (Number, Number, Number) -> b) -> [b]

// Generic function to generate a continuous week calendar of 'd'.
// This function will fill the blank spaces of the week
// with the next or previous week if needed.
// Apply 'f' to each day. This function will receive the 'year', 'month' and 'day'.


$ weekC(d : Date) -> [Number]

// Generate a list of days of the week.
// This function will fill the blank spaces of the week
// with the next or previous week if needed.

= weekC(new Date(2017, 0, 1)) == weekCImpl(new Date(2017, 0, 1), (y, m, d) => [y, m, d])


$ monthImpl(d : Date, f : Number -> b) : [[b]]

// Generic version of the function to generate a month calendar.
//
// Note: Blank spaces of the 'Array' are all 'null' and 'f' is not applied
// to them.


$ month(date : Date) -> [[Number]]

// Generate a list of weeks of (list of lists).

= month(new Date(2017, 0, 1)) == monthImpl(new Date(2017, 0, 1), identity)


$ monthCImpl(d : Date, f : (Number, Number, Number) -> b) -> [[b]]

// Generic function to generate a continuous month calendar of 'd'.
// This function will fill the blank spaces of the week
// with the next or previous week if needed.
// Apply 'f' to each day. This function will receive the 'year', 'month' and 'day'.


$ monthC(d : Date) -> [[Number]]

// Generate a list of week of days of the month.
// This function will fill the blank spaces of the week
// with the next or previous week if needed.

= monthC(new Date(2017, 0, 1)) == monthCImpl(new Date(2017, 0, 1), (y, m, d) => [y, m, d])
```


## license

See `license.md` or visit [Unlicense](http://unlicense.org).
