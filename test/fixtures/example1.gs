let list = [1, 2, 3]
let other-list = [...list, 4, 5, 6] // now contains [1, 2, 3, 4, 5, 6]

// another way to specify an array
let items =
  * "Apples"
  * "Bananas"
  * "Cherries"

let obj = {
  list // same as list: list
  sum: 6
  f()
    "result" // same as f: # "result"
}

let great-apes =
  bonobos:
    awesomeness: "pretty cool"
    population: 40_000
  humans:
    awesomeness: "let's not say anything bad about these guys"
    population: 7_000_000_000
  gorillas:
    awesomeness: "clearly the best"
    population: 100_000

let special = {
  [1 + 2]: "three"
  "key$i": "interpolated key"
  class: "JavaScript would fail on the 'class' key."
}
