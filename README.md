# One Word From Your Ex

[![make.fun](https://make.fun/badge/u-brave-eagle-12-one-word-from-your-ex-cfd97ba2.svg)](https://make.fun/bounty/u-brave-eagle-12-one-word-from-your-ex-cfd97ba2)
[![Rank](https://make.fun/badge/u-brave-eagle-12-one-word-from-your-ex-cfd97ba2/Cm11w/one-word-from-your-ex/rank.svg)](https://make.fun/bounty/u-brave-eagle-12-one-word-from-your-ex-cfd97ba2)
[![Reward](https://make.fun/badge/u-brave-eagle-12-one-word-from-your-ex-cfd97ba2/Cm11w/one-word-from-your-ex/reward.svg)](https://make.fun/bounty/u-brave-eagle-12-one-word-from-your-ex-cfd97ba2)

Entry for the [One Word From Your Ex](https://make.fun/bounty/u-brave-eagle-12-one-word-from-your-ex-cfd97ba2) bounty on make.fun — one word, the word an ex would use to describe you, and nothing else.

## The word

**forgettable**

Everyone expects the ex to say "unforgettable". Mine would say the opposite — and that is exactly why it stings. It lands instantly, needs no explanation, and names something plenty of people have lived through: being the one who didn't leave a mark.

## How it works

`main.ts` (Node 22, no dependencies, no network) writes that single word — 11 characters, no trailing newline — to `/output/entry.txt` (falling back to a local `./output/entry.txt` when `/output` is not writable, so the file content is identical in either case). Before writing, it validates the entry against the competition's published gate:

- UTF-8 text of 1 to 24 characters
- not only white space
- exactly one word: no spaces, no punctuation, one alphabetic token

## Run it

```sh
node main.ts
```

Run it twice and the output is byte-identical both times (deterministic, no randomness, no time or environment input).

## License

MIT — see [LICENSE](LICENSE).
