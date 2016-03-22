# Tempora

Intervals, working together.

## Introduction

Tempora helps you put intervals on a timeline (though it doesn't have to actually be time).

Say, for example, you need at least one security guard on duty during business hours. If you've got the guards' shift schedules, then Tempora will do the rest:

```js
const Tempora = require('tempora')

const securityCoverage = Tempora.timeline();

const businessHours = {lo: 9, hi: 17}; // 9 AM to 5 PM

const guardShifts = [
    {lo: 8.5, hi: 11}, // 8:30 AM to 11:00 AM
    {lo: 11, hi: 15}, // 11:00 AM to  3:00 PM
    {lo: 16, hi: 17.5} // 4:00 PM to  5:30 PM
];

// Add the shifts to the security coverage timeline:
securityCoverage.insert(guardShifts);

if (!securityCoverage.contains(businessHours)) {
    // Uh-oh! No security on duty!
    // ...
}
```

You can use intervals of anything, not just numbers.

> **You:** Whatttt? You serious?
>
> **Me:** You bet your ass I'm serious.

Here's how:

1. Write a custom comparator:

    ```js
    const sizeComparator = {
        eq: (l, r) => l === r,
        lt: function (l, r) {
            const sizes = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl'];

            return sizes.indexOf(l) < sizes.indexOf(r);
        }
    };
    ```

2. Feed it to the timeline:

    ```js
    const availableSizes = timeline({comparator: sizeComparator});
    ```

3. Use it:

    ```js
    availableSizes.insert({lo: 'xs', hi: 'xxl'});

    // Ran out of mediums!
    availableSizes.remove({lo: 's', hi: 'l'});

    console.log(availableSizes.intervals())
    // => [{lo: 'xs', hi: 's'}, {lo: 'l', hi: 'xxl'}]
    ```

## Install & Import

For Node:

```sh
npm install git://github.com/akivajgordon/tempora.git
```

```js
const Tempora = require('tempora');
```

and for the browser:

```sh
bower install git://github.com/akivajgordon/tempora.git
```

```html
<script src="bower_components/tempora/dist/tempora.min.js"></script>
```

## Basic Usage

Get started by creating a timeline:

```js
const Tempora = require('tempora');

const t = Tempora.timeline();
```

With a timeline, you can insert or remove interval-like objects that have `lo` and `hi` properties indicating the low and high endpoints of the interval, respectively:

```js
t.insert({lo: 0, hi: 10});
t.remove({lo: 2, hi: 5});
```

This will leave you with intervals `{0, 2}` and `{5, 10}`:

```js
t.intervals(); // => [ { lo: 0, hi: 2 }, { lo: 5, hi: 10 } ]
```

Want to know if the timeline contains an interval?

```js
t.contains({lo: 6, hi: 8}); // => true
t.contains({lo: 4, hi: 9}); // => false
```

## API

### `timeline(options)`

Creates a new timeline.

By default, a timeline compares interval endpoints in the traditional sense, like numbers, using standard comparison operators like `===` and `<`.

An optional `options` object with the following properties can be provided:

| Property     | Description                                                         |
| :----------- | :------------------------------------------------------------------ |
| `comparator` | A comparator object. See "Custom Comparators" for more information. |

#### Custom Comparators

A custom comparator allows a timeline to work with non-number intervals by teaching it how to compare interval endpoints.

Simply supply the timeline with an object that implements methods `eq` and `lt` that can compare two interval endpoints, say "L" and "R".

`eq` answers the question:

> Is "L" equal to "R"?

`lt` answers the question:

> Is "L" less than "R"?

As an example, a [Moment](http://momentjs.com) comparator might be implemented like this:

```js
const momentComparator = {
    eq: (l, r) => l.isSame(r),
    lt: (l, r) => l.isBefore(r)
}

const t = timeline({comparator: momentComparator});
```

Now you can insert Moment intervals:

```js
t.insert({lo: moment('2016-03-21'), hi: moment('2016-04-01')});
```

### `timeline#intervals()`

Returns an array of intervals on the timeline.

### `timeline#insert(interval)`

Insert the interval, `interval`, into the timeline.

An interval is an object as follows:

| Property | Description                        |
| :------- | :--------------------------------- |
| `lo`     | The low endpoint of the interval.  |
| `hi`     | The high endpoint of the interval. |

As intervals are inserted, the timeline joins intersecting intervals. For example:

```js
t.insert({lo: 0, hi: 10});
t.insert({lo: 20, hi: 30});
t.insert({lo: 5, hi: 25});

t.intervals(); // [{lo: 0, hi: 30}]
```

Even though three intervals were inserted, they've all been joined into one.

### `timeline#insert(intervals)`

Insert an array of intervals, `intervals`, into the timeline.

This is a convenience to insert multiple intervals at once.

### `timeline#remove(interval)`

Remove the interval, `interval`, from the timeline.

An interval is an object as follows:

| Property | Description                                      |
| :------- | :----------------------------------------------- |
| `lo`     | The low endpoint of the interval to be removed.  |
| `hi`     | The high endpoint of the interval to be removed. |

### `timeline#remove(intervals)`

Remove an array of intervals, `intervals`, from the timeline.

This is a convenience to remove multiple intervals at once.

### `timeline#contains(interval)`

Returns a boolean indicating if the timeline contains the entire interval, `interval`.

## Contributing

Pull requests are welcome! Fork and clone the repo, then from the project directory:

```sh
npm install
```

Tempora is built on a suite of delightful Jasmine unit tests. If contributing a bug fix or an enhancement, please include unit tests. Bonus points for TDD. Everyone wins!

Run the test suite with:

```sh
npm test
```
