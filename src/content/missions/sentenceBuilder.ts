import { blank, buildMission, gloss, mc, order, sort, typed } from '../authoring';
import type { Mission } from '../../engine/types';

const C = 'sentence-builder' as const;
const skill = 'Writing' as const;
const BUILD = 'Build the sentence.';

export const SENTENCE_BUILDER: Mission[] = [
  buildMission(
    { id: 'sb-y1-m1', categoryId: C, yearLevel: 1, order: 1, title: 'Simple Sentences', blurb: 'Put words in the right order.', skill, objective: 'Construct simple sentences with correct word order and a full stop.' },
    [
      order(BUILD, ['Aina', 'plays', 'badminton', '.'], 'Who plays? Start with the name.', 'A sentence starts with who does the action: "Aina plays badminton."', { image: 'act:badminton' }),
      order(BUILD, ['I', 'like', 'apples', '.'], 'Start with "I".', '"I like apples." A sentence ends with a full stop.', { image: 'apple*3' }),
      order(BUILD, ['the', 'cat', 'is', 'sleeping', '.'], 'Start with "The cat".', '"The cat is sleeping." The first word starts with a capital letter.', { image: 'cat' }),
      order(BUILD, ['this', 'is', 'my', 'bag', '.'], 'Start with "This".', '"This is my bag."', { image: 'bag' }),
      blank('Choose the word that fits.', 'The ___ is big.', ['elephant', 'run', 'sing'], ['elephant'], 'Which word is a thing or an animal?', '"The elephant is big." We need a naming word after "The".', { image: 'elephant' }),
      order(BUILD, ['Ravi', 'can', 'swim', '.'], 'Who can swim?', '"Ravi can swim."', { image: 'act:swim' }),
      mc('Which sentence is correct?', 'My name is Siti.', ['my name is Siti.', 'My name is siti.', 'my name is siti'], 'Look at the first letter, the name and the end.', 'A sentence starts with a capital letter. Names start with a capital letter. A sentence ends with a full stop.'),
      order(BUILD, ['we', 'go', 'to', 'school', '.'], 'Start with "We".', '"We go to school."', { image: 'school' }),
    ],
  ),
  buildMission(
    { id: 'sb-y1-m2', categoryId: C, yearLevel: 1, order: 2, title: 'Questions and Answers', blurb: 'Build questions and answers.', skill, objective: 'Construct simple questions and answers with correct punctuation.' },
    [
      order('Build the question.', ['what', 'is', 'your', 'name', '?'], 'Questions often start with "What".', '"What is your name?" A question ends with a question mark.'),
      order(BUILD, ['I', 'am', 'seven', '.'], 'Start with "I".', '"I am seven."'),
      mc('Which one needs a question mark (?) at the end?', 'Where is my pencil', ['My pencil is red', 'I have a pencil', 'This is my pencil'], 'Which one asks something?', '"Where is my pencil?" asks a question, so it needs a question mark.'),
      order('Build the question.', ['is', 'this', 'your', 'book', '?'], 'Start with "Is".', '"Is this your book?"', { image: 'book' }),
      order('Build the answer.', ['yes', ',', 'it', 'is', '.'], 'Start with "Yes". The comma comes next.', '"Yes, it is." We put a comma after "Yes".'),
      blank('Choose the word that fits.', '___ you like durian?', ['Do', 'Does', 'Are'], ['Do'], 'We use this word with "you".', '"Do you like durian?" We use "Do" with "you".'),
      order('Build the question.', ['how', 'old', 'are', 'you', '?'], 'Start with "How old".', '"How old are you?"'),
      mc('Which one is a question?', 'Can you swim?', ['I can swim.', 'You can swim.', 'Swim now.'], 'Look for the question mark.', '"Can you swim?" is a question. It ends with "?".'),
    ],
  ),
  buildMission(
    { id: 'sb-y1-m3', categoryId: C, yearLevel: 1, order: 3, title: 'Describing Things', blurb: 'Build sentences that describe.', skill, objective: 'Construct simple descriptive sentences using adjectives.' },
    [
      order(BUILD, ['the', 'apple', 'is', 'red', '.'], 'What colour is the apple?', '"The apple is red."', { image: 'apple:red' }),
      order(BUILD, ['I', 'have', 'a', 'big', 'kite', '.'], 'The describing word "big" comes before "kite".', '"I have a big kite." The describing word goes before the thing.', { image: 'kite' }),
      blank('Choose the word that fits.', 'The sun is ___.', ['hot', 'cold', 'sad'], ['hot'], 'How does the sun feel on your skin?', '"The sun is hot."', { image: 'sun' }),
      order(BUILD, ['my', 'cat', 'is', 'small', '.'], 'Start with "My".', '"My cat is small."', { image: 'cat' }),
      order(BUILD, ['Mei Ling', 'has', 'long', 'hair', '.'], 'Who has long hair?', '"Mei Ling has long hair."'),
      mc('Which sentence matches the picture?', 'The ball is blue.', ['The ball is red.', 'The bag is blue.', 'The balls are blue.'], 'Look at the thing, the colour and how many.', 'There is one blue ball, so "The ball is blue."', { image: 'ball:blue' }),
      order(BUILD, ['the', 'elephant', 'is', 'big', 'and', 'grey', '.'], 'Use "and" to join two describing words.', '"The elephant is big and grey." You can also say "grey and big".', { image: 'elephant', alt: [['the', 'elephant', 'is', 'grey', 'and', 'big', '.']] }),
      blank('Choose the word that fits.', 'This is a ___ flower.', ['pink', 'run', 'under'], ['pink'], 'Which word describes the flower?', '"This is a pink flower." Pink is a describing word.', { image: 'flower:pink' }),
    ],
  ),
  buildMission(
    { id: 'sb-y2-m1', categoryId: C, yearLevel: 2, order: 1, title: 'Daily Life Sentences', blurb: 'Build sentences about your day.', skill, objective: 'Construct sentences about routines, including time phrases and joining words.' },
    [
      order(BUILD, ['Arjun', 'goes', 'to', 'school', 'by', 'bus', '.'], 'Who goes? Where? How?', '"Arjun goes to school by bus."', { image: 'bus' }),
      order(BUILD, ['I', 'brush', 'my', 'teeth', 'every', 'morning', '.'], 'The time words can go at the start or the end.', '"I brush my teeth every morning." "Every morning I brush my teeth." is also correct.', { image: 'act:brush', alt: [['every', 'morning', 'I', 'brush', 'my', 'teeth', '.']] }),
      blank('Choose the joining word.', 'I like rice ___ I do not like noodles.', ['but', 'and', 'so'], ['but'], 'The two ideas are different.', 'We use "but" to join two different ideas.'),
      order(BUILD, ['my', 'father', 'cooks', 'nasi lemak', 'on', 'Sundays', '.'], 'Who cooks? What? When?', '"My father cooks nasi lemak on Sundays." "On Sundays my father cooks nasi lemak." is also correct.', { alt: [['on', 'Sundays', 'my', 'father', 'cooks', 'nasi lemak', '.']] }),
      mc('Which sentence is written correctly?', 'We play football on Saturday.', ['we play football on Saturday.', 'We play football on saturday.', 'We play football on Saturday'], 'Check the first letter, the day and the end.', 'Sentences start with a capital letter. Days of the week start with a capital letter. Sentences end with a full stop.'),
      order(BUILD, ['she', 'drinks', 'milk', 'and', 'eats', 'bread', '.'], '"and" joins two actions.', '"She drinks milk and eats bread." "She eats bread and drinks milk." is also correct.', { alt: [['she', 'eats', 'bread', 'and', 'drinks', 'milk', '.']] }),
      blank('Choose the joining word.', 'It is raining, ___ I take my umbrella.', ['so', 'but', 'or'], ['so'], 'The rain is the reason.', 'We use "so" to show what happens because of something.', { image: 'umbrella' }),
      order(BUILD, ['the', 'children', 'are', 'playing', 'in', 'the', 'park', '.'], 'Who is playing? Where?', '"The children are playing in the park."', { image: 'park' }),
    ],
  ),
  buildMission(
    { id: 'sb-y2-m2', categoryId: C, yearLevel: 2, order: 2, title: 'Joining Ideas', blurb: 'Join ideas with and, but and so.', skill, objective: 'Join simple ideas using and, but and so.' },
    [
      blank('Choose the joining word.', 'I have a cat ___ a dog.', ['and', 'but', 'so'], ['and'], 'You have both pets.', 'We use "and" to add another thing.'),
      blank('Choose the joining word.', 'Danial is tall, ___ his brother is short.', ['but', 'and', 'so'], ['but'], 'Tall and short are different.', 'We use "but" when ideas are different.'),
      order(BUILD, ['I', 'can', 'read', 'but', 'I', 'cannot', 'swim', '.'], 'Put "but" between the two ideas.', '"I can read but I cannot swim."'),
      mc('Which sentence joins the ideas best?', 'I am hungry, so I eat a sandwich.', ['I am hungry, but I eat a sandwich.', 'I am hungry, or I eat a sandwich.', 'I am hungry, because I eat a sandwich.'], 'Being hungry is the reason for eating.', '"so" shows the result: I am hungry, so I eat.'),
      order(BUILD, ['Wei Jie', 'likes', 'drawing', 'and', 'painting', '.'], 'Put "and" between the two hobbies.', '"Wei Jie likes drawing and painting." You can also swap the hobbies.', { alt: [['Wei Jie', 'likes', 'painting', 'and', 'drawing', '.']] }),
      blank('Choose the joining word.', 'The shop is closed, ___ we go home.', ['so', 'but', 'and'], ['so'], 'What happens because the shop is closed?', 'We use "so" to show a result.'),
      order(BUILD, ['it', 'is', 'hot', 'so', 'we', 'go', 'swimming', '.'], 'First the reason, then "so", then the result.', '"It is hot so we go swimming."', { image: 'sun' }),
      mc('Which is the best ending? "I wanted to play outside, but ..."', 'it was raining.', ['I played outside.', 'it was sunny.', 'and I liked it.'], '"but" shows something stopped the plan.', '"but it was raining" explains why the plan did not happen.'),
    ],
  ),
  buildMission(
    { id: 'sb-y2-m3', categoryId: C, yearLevel: 2, order: 3, title: 'Capitals and Punctuation', blurb: 'Fix capital letters, full stops and question marks.', skill, objective: 'Use capital letters, full stops, question marks, exclamation marks and commas correctly.' },
    [
      mc('Which sentence is correct?', 'Aina lives in Kuala Lumpur.', ['aina lives in Kuala Lumpur.', 'Aina lives in kuala lumpur.', 'Aina lives in Kuala Lumpur'], 'Names of people and places need capital letters.', 'People and places start with capital letters, and a sentence ends with a full stop.'),
      mc('Look: "My friend ravi has a red bicycle." Which word needs a capital letter?', 'ravi', ['friend', 'red', 'bicycle'], 'Which word is a name?', 'Ravi is a name, so it starts with a capital letter.'),
      mc('Which mark goes at the end? "What time is it_"', '?', ['.', ',', '!'], 'Is it asking something?', 'It is a question, so it ends with a question mark.'),
      order('Build the question.', ['where', 'do', 'you', 'live', '?'], 'Start with "Where".', '"Where do you live?"'),
      mc('Which sentence shows a strong feeling?', 'Wow, what a big fish!', ['This is a fish.', 'Is this a fish?', 'The fish is in the river.'], 'Look for an exclamation mark (!).', 'An exclamation mark shows a strong feeling, like surprise.'),
      mc('Which sentence is correct?', 'I bought apples, oranges and bananas.', ['I bought apples oranges and bananas.', 'I bought, apples oranges and bananas.', 'I bought apples, oranges, and, bananas.'], 'Commas separate things in a list.', 'Use commas between things in a list. Use "and" before the last thing.'),
      order(BUILD, ['on', 'Monday', ',', 'we', 'have', 'art', '.'], 'Start with the day. A comma comes after it.', '"On Monday, we have art."'),
      mc('Which day is written correctly?', 'Friday', ['friday', 'FRIday', 'fRiday'], 'Days start with one capital letter.', 'Days of the week start with a capital letter: Friday.'),
    ],
  ),
  buildMission(
    { id: 'sb-y3-m1', categoryId: C, yearLevel: 3, order: 1, title: 'Longer Sentences', blurb: 'Build longer sentences with more detail.', skill, objective: 'Construct longer sentences with detail and joining words (and, but, so, because).' },
    [
      order(BUILD, ['my', 'brother', 'and', 'I', 'walk', 'to', 'school', 'every', 'day', '.'], 'Who walks? Where? When?', '"My brother and I walk to school every day." You can also start with "Every day".', { alt: [['every', 'day', 'my', 'brother', 'and', 'I', 'walk', 'to', 'school', '.']] }),
      order(BUILD, ['Priya', 'wears', 'a', 'blue', 'dress', 'to', 'the', 'party', '.'], 'The colour comes before "dress".', '"Priya wears a blue dress to the party."'),
      blank('Choose the joining word.', 'I was late for school ___ I missed the bus.', ['because', 'so', 'but'], ['because'], 'Missing the bus is the reason.', '"because" gives a reason.'),
      typed('Type the missing joining word.', 'She opened the window ___ it was hot.', [['because', 'as', 'since']], 'Why did she open the window?', '"because" gives the reason. "as" and "since" also work here.'),
      order(BUILD, ['we', 'played', 'a', 'board', 'game', 'after', 'lunch', '.'], 'The time phrase can go at the start or the end.', '"We played a board game after lunch." "After lunch we played a board game." is also correct.', { alt: [['after', 'lunch', 'we', 'played', 'a', 'board', 'game', '.']] }),
      mc('Join the sentences: "The cat was hungry. It ate the fish."', 'The cat was hungry, so it ate the fish.', ['The cat was hungry, but it ate the fish.', 'The cat was hungry because it ate the fish.', 'The cat ate the fish, so it was hungry.'], 'Which came first: being hungry or eating?', 'The cat was hungry first. "so" shows what it did next.'),
      order(BUILD, ['the', 'tall', 'boy', 'with', 'glasses', 'is', 'my', 'cousin', '.'], 'Start with "The tall boy".', '"The tall boy with glasses is my cousin."'),
      typed('Type the missing joining word.', 'I like reading ___ I do not like writing.', [['but', 'yet']], 'The two ideas are different.', '"but" joins two different ideas.'),
    ],
  ),
  buildMission(
    { id: 'sb-y3-m2', categoryId: C, yearLevel: 3, order: 2, title: 'Sentence Parts', blurb: 'Who, what, where and when.', skill, objective: 'Identify and arrange sentence parts: who, doing word, what, where and when.' },
    [
      sort('Does it tell us who or where?', ['Who', 'Where'], [['my teacher', 'Who'], ['our neighbour', 'Who'], ['the doctor', 'Who'], ['at the beach', 'Where'], ['in the canteen', 'Where'], ['under the bridge', 'Where']], 'Where-words often start with "at", "in" or "under".', 'People tell us "who". Phrases like "at the beach" tell us "where".'),
      order('Arrange the sentence parts.', ['Hafiz', 'ate', 'roti canai', 'at the stall', 'yesterday', '.'], 'Who? Did what? What? Where? When?', '"Hafiz ate roti canai at the stall yesterday." You can also start with "Yesterday".', { alt: [['yesterday', 'Hafiz', 'ate', 'roti canai', 'at the stall', '.']] }),
      sort('Does it tell us when or where?', ['When', 'Where'], [['on Sunday', 'When'], ['in the morning', 'When'], ['after school', 'When'], ['at the market', 'Where'], ['near the river', 'Where'], ['in the hall', 'Where']], 'When-words tell us about time.', '"On Sunday", "in the morning" and "after school" tell us when.'),
      order(BUILD, ['the', 'pupils', 'are', 'planting', 'flowers', 'in', 'the', 'garden', '.'], 'Who? Doing what? Where?', '"The pupils are planting flowers in the garden."', { image: 'act:plant' }),
      mc('What is the doing word in: "The baby sleeps in the cot."', 'sleeps', ['baby', 'cot', 'in'], 'What does the baby do?', '"sleeps" is the doing word (verb).', { glossary: [gloss('cot', null, 'a small bed for a baby', 'The baby is in the cot.')] }),
      order('Arrange the sentence parts.', ['every evening', 'my grandfather', 'reads', 'the newspaper', '.'], 'You can start with the time or with the person.', '"Every evening my grandfather reads the newspaper." "My grandfather reads the newspaper every evening." is also correct.', { alt: [['my grandfather', 'reads', 'the newspaper', 'every evening', '.']] }),
      blank('Choose the words that fit.', 'Mei Ling ___ her bicycle ___ the park.', ['rides', 'ride', 'in', 'under'], ['rides', 'in'], 'One person, so the doing word ends in -s.', '"Mei Ling rides her bicycle in the park."', { image: 'act:cycle' }),
      mc('Which sentence makes sense?', 'The fish swims in the pond.', ['The pond swims in the fish.', 'The fish swims in the sky.', 'In the fish swims the pond.'], 'Who is doing the swimming?', 'Fish swim in ponds. The other sentences mix up the parts.'),
    ],
  ),
  buildMission(
    { id: 'sb-y3-m3', categoryId: C, yearLevel: 3, order: 3, title: 'Mini Paragraphs', blurb: 'Put sentences together in order.', skill, objective: 'Sequence sentences into a short paragraph using sequence words and punctuation.' },
    [
      order('Put the sentences in order to make a paragraph.', ['First, I wake up at six.', 'Then, I take a shower.', 'After that, I eat breakfast.', 'Finally, I go to school.'], 'Look for First, Then, After that and Finally.', 'Sequence words show the order: First, Then, After that, Finally.', { kind: 'sequence' }),
      blank('Choose the sequence words.', '___, mix the flour and eggs. ___, bake the cake.', ['First', 'Then', 'Next', 'Finally'], ['First', 'Then|Next'], 'Which step comes first?', '"First" starts the steps. "Then" or "Next" shows what comes after.'),
      mc('Which word best starts the last sentence of a story? "___, we went home."', 'Finally', ['First', 'Next', 'Before'], 'Which word means "at the end"?', '"Finally" tells us it is the last thing.'),
      order(BUILD, ['Kavitha', 'helps', 'her', 'mother', 'because', 'she', 'is', 'kind', '.'], 'Put "because" before the reason.', '"Kavitha helps her mother because she is kind."'),
      typed('Type a joining word that shows the result.', 'I am thirsty, ___ I drink some water.', [['so']], 'Being thirsty makes you drink.', '"so" shows the result.'),
      mc('Which sentence does NOT belong in a paragraph about cats?', 'My uncle drives a red car.', ['Cats like to sleep in the sun.', 'Many cats enjoy playing with string.', 'Cats clean themselves with their tongues.'], 'Which sentence is not about cats?', 'A paragraph keeps to one topic. The car sentence is not about cats.'),
      order(BUILD, ['when', 'it', 'rains', ',', 'we', 'stay', 'indoors', '.'], 'Start with "When". The comma comes after "rains".', '"When it rains, we stay indoors."'),
      mc('Choose the correct sentence.', '"Can I borrow your ruler?" asked Ravi.', ['"Can I borrow your ruler." asked Ravi.', 'Can I borrow your ruler? asked Ravi.', '"can I borrow your ruler?" asked Ravi.'], 'Spoken words go inside speech marks.', 'Speech marks go around the spoken words. A question inside them ends with "?".'),
    ],
  ),
];
