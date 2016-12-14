#!/usr/bin/env node

const pkg = require('./package');
const optionator = require('optionator');
const options = require('./options');
const Random = require('random-js');
const random = Random(Random.engines.browserCrypto);

/**
* Flips a coin n number of times and returns the 
* @returns Array - Tuple counting the number of [heads, tails]
*/
const flipCoins = n => { 
	const results = [0,0];
	for(let i = 0; i < n; i++) {
		results[+random.bool()]++;
	}

	return results;
};

const configuration = optionator({
	prepend: 'Usage: flip [options]',
	append: `Version ${pkg.version}`,
	options
});

const { help, times, heads, tails, debug } = configuration.parseArgv(process.argv);

const debugInvoke = fn => debug && fn();

if(help) {
	return console.log(configuration.generateHelp());
}

debugInvoke(() => console.time('flipping coins'));
const [headsCount, tailsCount] = flipCoins(times);
debugInvoke(() => console.timeEnd('flipping coins'));
debugInvoke(() => console.log('heads', headsCount, 'tails', tailsCount));

const winner = headsCount > tailsCount
	? heads
	: tailsCount > headsCount
		? tails
		: 'TIE';
const nFlips = `${times} flip${times === 1 ? '' : 's'}`;

console.log(`The winner after ${nFlips} is: ${winner}`);
