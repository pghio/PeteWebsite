---
layout: ../../layouts/BlogLayout.astro
title: "Falls the Shadow"
description: "In 2016 the godfather of AI said to stop training radiologists. A decade later their pay hit records. The same forecast error is now being made about writing. An essay on the two halves of every job, the vagueness spiral, and a falsifiable bet on the English major."
publishDate: "2026-07-08"
category: "Essay"
ogImage: "/images/posts/meaning-radiologists.png"
---

![What happened to the radiologists: Hinton's 2016 forecast beside the 2026 record demand](/images/posts/meaning-radiologists.svg)

In 2016, Geoffrey Hinton, the man they call the godfather of AI, said we should stop training radiologists. It was completely obvious, he said, that within five years deep learning would do the job better than people do. He was the most qualified person alive to make that prediction, and the audience had every reason to believe him.

A decade later, radiology is having the best labor market in its history. Average salaries reached $571,000 in 2025, up nine percent in a single year. Residency programs offered a record number of positions. More than four thousand radiologist jobs sat open this spring, taking over four months on average to fill. And the machines did get better at reading scans. Enormously better. Both things happened at once. The rest of this essay is about why.

The Mayo Clinic runs more than 250 AI models inside its radiology department. It also employs 55 percent more radiologists than it did when Hinton spoke. The hospital that adopted the technology hardest hired the most humans. Nobody predicted that sentence in 2016.

What the forecast missed is a pattern old enough to have a name. Reading a scan is two jobs wearing one coat. One half is pattern work: is there a shadow on this image. The other half is judgment: what does this shadow mean for this patient, with this history, and what should anyone do about it. The machine took a large share of the pattern half, and reading got faster and cheaper.

So medicine ordered more scans. More scans meant more findings, more ambiguity, more judgment calls per day than any department had staffing for. Demand for the half only people can do went up because the other half got cheap. Economists have watched this move for two centuries. ATMs were supposed to end bank tellers; branches got cheaper to run, banks opened more branches, and teller employment rose for decades. The spreadsheet was supposed to end the accountant. It ended ledger arithmetic, and analysis exploded.

Now run the same split on writing.

![Every job is two jobs: the half the machine takes and the half that gets precious](/images/posts/meaning-two-jobs.svg)

Writing is also two jobs wearing one coat. One half is prose: grammatical sentences, in the right order, in a reasonable tone. The other half is meaning: knowing what you are trying to say. The two came bundled for so long that we treated them as one skill and called it being a good writer. Three years ago the prose half became free. Anyone can now produce competent paragraphs on any subject for nothing. Which leaves everything riding on the half that is left.

I have some of my own evidence about where that leaves us. Earlier this year I benchmarked eight language models on my product's real workload, from a model costing fifteen cents per million tokens to one costing a hundred times that. On clear requests, price bought almost nothing; every model did fine. On ambiguous requests, every model hit the same wall, cheap and expensive alike. The most capable intelligence money could rent could not resolve what the request itself left unresolved. And the smartest behavior I observed anywhere in the study was not a clever answer. It was a model declining to guess, and asking a better clarifying question than the others asked. The frontier of machine intelligence, at least on my data, is a question pointed back at the person: what do you mean?

That is the shape of the decade, stated as plainly as I can. Intelligence became abundant. Intention did not. The machine can build nearly anything you can specify, which makes specification the job. And deciding what you want is the one task you cannot hand off, because handing it off requires the decision. Every delegation begins with the thing the machine cannot supply.

Which brings me to the most repeated career advice of my lifetime. Learn to code was right about the destination and wrong about the language. The instinct was sound: everyone should learn to instruct machines. But we spent fifteen years teaching people to speak the machine's language, and then the machine learned ours. The interface to software is becoming the English sentence. The precision that used to live in syntax now has to live in the meaning.

Now for the part that worries me more than any job forecast. The machine is not just waiting on our intention. It is quietly untraining it.

Writing was never the clean transcription of finished thought. It was the apparatus for finishing it. You find out what you think by trying to say it and watching it come out wrong; the first draft is where a hunch gets caught being vaguer than it felt. Hand the drafting to a machine and the words still arrive, but the finding does not. You skip exactly the collisions that turn a notion into an intention.

The loop runs downhill from there. The less you draft, the less you discover what you mean. The less you know what you mean, the vaguer your instructions. And vagueness is the one input a model punishes: ask for nothing in particular and you get everyone in general, the statistical center of all text, competent and empty. Faced with output like that, most people do not take the thinking back. They hand over more of it. The early lab evidence points the same way; the studies are young and small, but nobody who has felt the pull really needs the EEG. The tool that raised the price of knowing your own mind is the same tool making it easier never to find out.

![The vagueness spiral: the machine drafts, you skip the thinking, your asks get vaguer, the output gets generic](/images/posts/meaning-vagueness-loop.svg)

We have solved a problem with this shape before. Ordinary life used to exercise the body for free, until industrial work stopped requiring it. We didn't shrug and go soft; we built gyms. Thinking has arrived at the same moment. The school essay, the memo, the email nobody wanted to write: that was the incidental gym for meaning what you say, and it is closing. The skill now belongs to the people who train it on purpose.

So here is a bet, and I want it on the record while the data still runs against me: the English major is coming back.

On paper the field is still shrinking a few percent a year, and the eulogies are already written; the New Yorker published "The End of the English Major" three years ago. But the early signals have turned. English majors are up nine percent since 2021. Entry-level software postings fell by nearly a third last year, and by some cuts of the data, new computer science graduates now face higher unemployment than new art history graduates, a sentence nobody would have believed in 2019. The president of one of the leading AI labs studied literature, and says plainly that her company hires people who can communicate.

![The obituary and the turn: a decade of decline, an uptick since 2021, and the bet](/images/posts/meaning-english-bet.svg)

None of that is proof, and I want to be honest about which way the headline number still points: down. But that is exactly where radiology sat in 2016. The confident consensus arrived at the precise moment its subject's complement was about to become free, and it read the cheapening of one half of the job as the death of the whole job. I think the English major is being talked out of existence at the moment its actual subject, meaning made precise in English, became the interface to software.

The eulogies made one mistake worth naming. They assumed the degree taught book appreciation. An English education, when it works, is the oldest gym we have for the meaning half. Close reading is noticing what a sentence actually commits to, rather than what you assumed it said. Revision is the supervised version of colliding with your own drafts. One of those is how you check a machine's work. The other is how you develop something worth asking it for. We spent a decade defunding that training, and then built a technology that bottlenecks on exactly the thing it trained.

Notice, too, which half of literacy got expensive. The machine made writing cheap, and in doing so it made reading precious. The world will produce a million competent paragraphs a minute from here on. The scarce act is the person who can look at one of them and say: this is not what I meant, and here is exactly where it misses.

Here is the falsifiable version, so you can hold me to it: within a decade, the national decline in English majors reverses. If it doesn't, I was wrong, and this paragraph will still be here.

The radiologists kept their jobs because judgment turned out to be the load-bearing half of the work. Our version of judgment is meaning. Every tool so far moves in the same direction: execution gets cheap, and the premium moves to whoever knows what they want. Wanting clearly is a skill. It was always the skill. The machines raised its price and closed its free gym in the same motion. The next advantage belongs to whoever keeps training.

*—Pete*
