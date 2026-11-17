There’s an AI model called Jev that can’t chat or write code. All it does is pick an answer from a list.

And a lot of people got very excited about it.

We hand it some text and a few options, and it tells us which option fits, and how sure it is. Spam or not spam. Happy customer or angry one. Billing problem or technical problem.

Some of us shrugged, because we’ve had classifiers for decades. Others had it playing Tetris. Same model. Yes, Tetris.

So is it boring, or is it a big deal? To figure that out, let’s look at how machines learned to sort text in the first place. It’s hard to judge Jev without knowing what came before it.

Classification just means sorting. A pile of text goes in, a label comes out. Email goes to spam or inbox. A review goes to positive or negative. A support ticket goes to billing or tech.

Computers are good with numbers, and sentences are messy. They can be ten words long or ten thousand. The classic sorting tools need an input of one fixed size. So the first job is always the same. We have to turn messy text into a neat row of numbers.

The oldest answer is also the simplest. We list every word in our training data. Say fifty thousand words. Every word gets its own slot. Then, for any message, we count. How many times does “free” appear? How about “refund”? We end up with a row of fifty thousand numbers, mostly zeros. A short message and a long one give us the same size row.

This is called a bag of words. Think of it as tossing the whole message in a bag and counting what’s inside.

Then a simple model, naive Bayes or logistic regression, learns which words lean toward which label. “Winner” and “prize” push toward spam. “Attached” and “meeting” push the other way.

And it works pretty well. Text sorting like this goes back to the early sixties, and it’s been behind plenty of spam filters. On movie reviews, it gets about ninety percent right. It’s fast, it’s cheap, and we can build one in an afternoon.

But there’s a problem. We lost the word order. “The dog bites the man” and “the man bites the dog” make the exact same row of numbers, even though one is ordinary and the other is news.

The fix came in two parts. First, we stop giving words a slot in a list, and give each word a short string of numbers instead. This is called an embedding. Words used in similar ways get similar numbers, so “good” ends up near “great” and far from “awful.” One flaw: a word gets the same numbers everywhere. “Bank” looks identical in “river bank” and “bank account.”

Second, we build a network that reads the words in order. The classic one is the recurrent network. It reads one word at a time and keeps a running summary, like someone holding the gist of a sentence in their head. Each new word updates the gist. So order matters now. Shuffle the words and the gist comes out different.

There’s a catch. That summary has a fixed size, so in a long text the early parts get squeezed out. These networks were also slow, since each step waits for the last one, and they were famously painful to train.

Then, in twenty eighteen, a method called U L M Fit showed a better way. Don’t start from zero. First, train the network on a huge pile of ordinary text so it learns how language works. Then fine-tune it on the small task we care about. Movie review accuracy jumped to around ninety-five percent.

Remember that idea: train big first, then fine-tune small. It keeps coming back.

There was another option too. Convolutional networks, the kind used for images, can slide a small window across a sentence, three words at a time, hunting for patterns like “surprisingly good acting.” They’re quick, because every window can be checked at once. On reviews, they did about as well as the old bag of words. Decent, but nothing special.

Then, in twenty seventeen, the transformer arrived. Its big trick is attention. Every word can look straight at every other word and decide which ones matter. There’s no fading summary to worry about. “Bank” can look at “river” and know which kind of bank it is.

Two families grew out of it. Encoder models, like BERT, read text in both directions and are built to understand. They put a special marker at the front, and once the model has read everything, that marker holds a summary we can hook a small classifier onto. Decoder models, like G P T, read left to right and predict the next word. They’re built to write.

For a while, encoders were the natural sorters and decoders were the writers. Then it turned out decoders could sort well too. We can just ask. “Is this review positive or negative?” A big enough model answers, no training needed.

The problem is that it’s sloppy. We want one clean label and sometimes we get a whole paragraph. And we’re paying for a giant model to do a small job.

So a lot of teams went with a less exciting option. They took a modern encoder like Modern BERT, added a small classification head, and fine-tuned it. With almost no effort, that gets around ninety-five percent on movie reviews. Even a small G P T two sized model reaches about ninety-two.

So by now we had two options, and a rule of thumb for picking.

Option one was to ask a big general model every time. No training, super flexible. But it’s slow, and it costs real money at scale.

Option two was to fine-tune a small model for the job. Fast and cheap to run. But we need labeled data, a training run, and a brand new model for every new problem.

The rule was simple. For a one-off question, ask the big model. For the same task a million times, train our own. But that left a gap. What we wanted was something quick and cheap that works on any question without training. That’s the gap Jev steps into.

Quick break. If this is helping, please subscribe to the channel. We explain AI topics in plain English, with no jargon, so none of it sounds like a foreign language. Okay, back to Jev.

Jev comes from a company called TypeSafe AI. We send it text, plus a question with some possible answers. It sends back its pick, and probabilities. They claim it matches the big Luna-class models on decision tasks, while being far faster and far cheaper.

There are three question types. The first is Choice, which picks one answer from a list. The second is Noul, a yes-or-no question where we get a probability for yes. Ask several Noul questions at once and we can handle texts that fit more than one label. The third is Score, which grades something against a rubric, like zero, one, or two.

For movie reviews, we paste in the review, ask “what’s the overall sentiment?”, and describe each option in plain words. Negative means an unfavorable opinion. Positive means a favorable one. Back comes “positive,” a confidence number, and a probability for each option.

When people ran all twenty-five thousand test reviews through it, it got about ninety-six and a half percent right. It took around twenty minutes and cost about sixty-five cents. That’s slightly ahead of a fine-tuned Modern BERT, with no training run. A couple of caveats. We can’t tell whether those reviews were in its training data. And the runs aren’t perfectly repeatable. Same input, slightly different totals. That’s normal for models served at scale.

This next part surprised a lot of people. If we swap the question, the same model can play Tetris in real time. Every move is just a choice from a short list: left, right, rotate, drop. A fine-tuned sentiment model can’t do that without starting over.

Nobody outside the company knows how Jev is built, so this part is a guess. But there’s a simple trick that could make a model like this work.

Normally, a classifier has one output per label. Two labels, two outputs. Want a third label? Rebuild the model.

The trick is to use only one output. For each option, we show the model three things: the text, the instructions, and that option’s description. It reads them and produces a single number for how well the option fits. We do this for every option, squash the scores into probabilities with softmax, and take the top one. Three options means three passes through the same scorer. Seven options, seven passes. The model doesn’t mind either way. The labels are just part of the input now, so they can change every time.

That part is easy to build. The hard part is making it work on tasks it has never seen, and that comes down to training data. The company says its data is entirely synthetic, but carefully made, not just dumped out of a chatbot. If that’s true, most of the effort went into the data. That fits something people in machine learning have seen for years. When a model isn’t good enough, better data usually helps more than another week of tweaking settings.

The part we find most interesting isn’t flashy at all. It’s the probabilities.

Say a model calls a review seventy-four percent positive. That number should mean something. If we collect a hundred reviews that got a seventy-four, about seventy-four should truly be positive. That’s calibration. Neural networks are usually bad at it. They sound sure about everything. A seventy-four and a fifty-four both give the label “positive,” but we’d treat them very differently. We could trust the first one. The second should go to a person.

One fix is temperature scaling. We divide the model’s raw scores by a single number before the softmax, tuned on held-out data. It changes how sure the model sounds, not which answer it picks.

TypeSafe says it trains for honesty directly, with a method it calls R L C D. The details are secret. But a published idea points the same way, called R L C R. Normally in this kind of reinforcement learning, a right answer earns one point and a wrong one earns zero. R L C R also asks the model to state how likely it is to be right, then subtracts the squared gap between that confidence and what actually happened.

Here’s how that plays out. Ninety percent sure and right? That scores zero point nine nine. Ninety percent sure and wrong? Minus zero point eight one. Almost a whole point lost for swagger. Twenty percent sure and wrong? Minus zero point zero four, a tiny slap, because it knew it might be wrong. So the model’s best move is to be honest about what it knows. In that paper, calibration error on one test dropped from zero point three seven to zero point zero three, with about the same accuracy.

We don’t know if Jev works this way.

A fair question is whether normal training already does this. In theory, yes. In practice, networks overfit their confidence. They can get more and more certain on training data without getting any more correct on new data. So extra tricks sometimes help a little, and we always have to check.

Soon after Jev launched, hundreds of clones appeared. Most take a small model, fine-tune it on sorting examples, and wrap a Jev-looking A P I around it. That’s the easy part. When people tested a couple of the better ones on the movie reviews, one scored about eighty-three percent and another about ninety-two. Neither could handle the Tetris test. Handling lots of different tasks is the hard part, and that’s what set Jev apart from the copies.

An open version would still be a big deal, mostly for privacy. Plenty of text can’t be sent to someone else’s servers.

The big labs noticed too. OpenAI announced its own version, the Decisions A P I, built on Luna.

It has weak spots too. Reportedly, Jev struggles with legal review in languages other than English, though a cheap translation step in front can patch that. And for one narrow task at huge volume, a custom fine-tuned model still wins on speed and accuracy.

Where would we use it? The obvious ones are sorting email and routing support tickets. It could also check text for prompt injection before it reaches an AI agent. Or decide how hard a big model should think. Or pick which instruction file an agent should load. Or act as a judge when we test other models.

None of that is a new ability, though. Classifiers are old. What changed is how hard it is to get one. It used to take a labeled dataset and a training run. Now it takes a sentence describing what we want. So the bar for building our own model is much higher than it was.

And if small, fast models handle the little choices inside bigger AI systems, the expensive models only get called when they’re really needed. That could make AI agents cheaper and quicker.

So is it just a boring tool? Kind of. It’s the same old sorting job. We just get to ask for it in plain English now, and the answer comes back almost instantly.
