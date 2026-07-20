---
layout: ../../layouts/BlogLayout.astro
title: "Falls the Shadow"
description: "In 2016 the godfather of AI said to stop training radiologists. A decade later their pay had climbed and employers reported shortages. This essay asks whether the same forecast error is now being made about writing—through the two halves of every job, the vagueness spiral, and a falsifiable bet on the English major."
publishDate: "2026-07-08"
category: "Essay"
ogImage: "/images/posts/meaning-two-jobs.png"
---

In 2016, Geoffrey Hinton, the man they call the godfather of AI, said we should stop training radiologists. It was completely obvious, he said, that within five years deep learning would do the job better than people do. [The forecast came from a pioneer of deep learning](https://www.newyorker.com/magazine/2017/04/03/ai-versus-md), and the audience had plenty of reason to believe him.

A decade later, the labor market looks nothing like extinction. [Doximity's 2025 compensation report](https://www.doximity.com/reports/physician-compensation-report/2025) put average radiologist pay at $571,749, up 7.5 percent in a year. The American College of Radiology describes a ["palpable shortage" with more than 1,400 positions on its career center](https://www.acr.org/Clinical-Resources/Publications-and-Research/ACR-Bulletin/How-Will-We-Solve-Our-Radiology-Workforce-Shortage), and its [2026 workforce update](https://www.acr.org/Clinical-Resources/Publications-and-Research/ACR-Bulletin/2026/radiologist-shortage-work-force-update) says residency positions continue to increase. AI adoption expanded, too. Both things happened at once.

Mayo Clinic says it has [more than 250 AI solutions in use or under development](https://newsnetwork.mayoclinic.org/discussion/louis-v-gerstner-jr-family-donates-25-million-to-establish-gerstner-scholars-program-in-ai-translation-at-mayo-clinic/) across the institution, while its radiology practice now includes [nearly 400 radiologists](https://jobs.mayoclinic.org/radiology). A 2025 report counted that as [55 percent growth since 2016](https://www.nytimes.com/2025/05/14/technology/ai-jobs-radiologists-mayo-clinic.html). One hospital cannot establish a law of automation, but it is a useful counterexample: aggressive adoption and aggressive hiring occurred in the same place.

What the forecast missed is a pattern old enough to have a name. Reading a scan is two jobs wearing one coat. One half is pattern work: is there a shadow on this image. The other half is judgment: what does this shadow mean for this patient, with this history, and what should anyone do about it. The machine took a large share of the pattern half, and reading got faster and cheaper.

So medicine ordered more scans. More scans meant more findings, more ambiguity, more judgment calls per day than any department had staffing for. Demand for the half only people can do went up because the other half got cheap. Economists have watched versions of this demand response for years: [automation can lower a service's cost enough to expand its market and its employment](https://www.nber.org/papers/w24235). ATMs reduced the number of tellers required per branch while branches and teller employment grew for decades; spreadsheets made ledger arithmetic cheap while demand for analysis expanded.

Now run the same split on writing.

![Every job is two jobs: the half the machine takes and the half that gets precious](/images/posts/meaning-two-jobs.svg)

Writing has the same split. One half is prose: grammatical sentences, in the right order, in a reasonable tone. The other half is meaning: knowing what you are trying to say. The two came bundled for so long that we treated them as one skill and called it being a good writer. Three years ago the prose half became nearly free. Anyone can now produce competent paragraphs on any subject for almost nothing. Which leaves more riding on the half that is left.

I have some of my own evidence about where that leaves us. Earlier this year I [benchmarked eight language models](/blog/llm-benchmark-stop-defaulting-to-the-frontier) on my product's real workload, from a model costing fifteen cents per million tokens to one costing a hundred times that. On clear requests, price bought almost nothing; every model did fine. On ambiguous requests, every model hit the same wall, cheap and expensive alike. The most capable intelligence money could rent could not resolve what the request itself left unresolved. And the smartest behavior I observed anywhere in the study was not a clever answer. It was a model declining to guess, and asking a better clarifying question than the others asked. The frontier of machine intelligence, at least on my data, is a question pointed back at the person: what do you mean?

Intelligence became abundant. Intention did not. The machine can execute a startling amount of what you specify, which makes specification a larger share of the job. Deciding what you want is the part you cannot fully hand off, because handing it off requires the decision. Every delegation begins with the thing the machine cannot supply.

For fifteen years, the most repeated career advice of my lifetime was *learn to code*. It was right about the destination and wrong about the language. Everyone should learn to instruct machines, but the machine has now learned ours. The interface to more software is becoming the English sentence. Some of the precision that used to live in syntax now has to live in the meaning.

The greater risk is that the machine is not just waiting on our intention. It may be quietly untraining it.

Writing was never the clean transcription of finished thought. It was the apparatus for finishing it. You find out what you think by trying to say it and watching it come out wrong; the first draft is where a hunch gets caught being vaguer than it felt. Hand the drafting to a machine and the words still arrive, but the finding does not. You skip exactly the collisions that turn a notion into an intention.

The loop runs downhill from there. The less you draft, the less you discover what you mean. The less you know what you mean, the vaguer your instructions. And vagueness is the input a model punishes: ask for nothing in particular and you get everyone in general, the statistical center of all text, competent and empty. Faced with output like that, it is tempting to hand over more of the thinking. The tool that raised the price of knowing your own mind also makes it easier never to find out.

![The vagueness spiral: the machine drafts, you skip the thinking, your asks get vaguer, the output gets generic](/images/posts/meaning-vagueness-loop.svg)

We have solved a problem with this shape before. Ordinary life used to exercise the body for free, until industrial work stopped requiring it. We didn't shrug and go soft; we built gyms. Thinking has arrived at the same moment. The school essay, the memo, the email nobody wanted to write: that was the incidental gym for meaning what you say, and it is closing. The skill now belongs to the people who train it on purpose.

So here is the falsifiable bet, while the national data still runs against me: within a decade, the decline in English majors reverses. If it does not, I was wrong, and this paragraph will still be here.

On paper the field is still shrinking, and the eulogies are already written; the *New Yorker* published ["The End of the English Major"](https://www.newyorker.com/magazine/2023/03/06/the-end-of-the-english-major) three years ago. The [American Academy of Arts and Sciences](https://www.amacad.org/humanities-indicators/higher-education/bachelors-degrees-humanities) finds that English degrees continued to decline through 2024. The counter-signals are narrower. In the New York Fed's [outcomes by major](https://www.newyorkfed.org/research/college-labor-market), recent computer science graduates face higher unemployment than recent art history graduates—a sentence few people would have believed in 2019. That comparison says nothing about wages or underemployment, and it does not prove English is recovering. It does show that the old hierarchy of "safe" and "impractical" degrees is less stable than it looked.

None of that is proof, and the headline number still points down. Radiology is a warning that a declining forecast can miss how technology changes the halves of a job. The eulogies for English may be making the same error: reading the cheapening of prose as the death of a field whose actual subject is meaning made precise in English, just as English becomes an interface to software.

The eulogies made one mistake worth naming. They assumed the degree taught book appreciation. An English education, when it works, trains the meaning half directly. Close reading is noticing what a sentence actually commits to, rather than what you assumed it said. Revision is the supervised version of colliding with your own drafts. One of those is how you check a machine's work. The other is how you develop something worth asking it for. We spent a decade defunding that training, and then built a technology that bottlenecks on exactly the thing the degree trained.

Notice, too, which half of literacy got expensive. The machine made writing cheap, and in doing so it made reading precious. The world can now produce more competent paragraphs than any person could read. The scarce act is looking at one and saying: this is not what I meant, and here is exactly where it misses.

The radiologists kept their jobs because judgment remained a load-bearing half of the work. Our version of judgment is meaning. The tools I use move in the same direction: execution gets cheaper, and the premium moves toward whoever knows what they want. Wanting clearly is a skill. The machines raised its price while removing some of the incidental practice that taught it. The next advantage belongs to whoever keeps training.

*—Pete*
