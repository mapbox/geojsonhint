## 0.3.4

* Tolerates `id` properties as numbers as well as strings, to match
  the actual specification.

## 0.3.3

* Enforces the type of the Feature.id property

## 0.3.2

* Detects & reports incorrectly nested LinearRing arrays

## 0.3.0

* Now uses `tap` for tests
* Modernized binary supports streams

## 0.2.0

* JSON parse errors are now parsed and output as objects rather than raw
  errors with strings.
* Stricter checking of LinearRing and Line coordinate length.
