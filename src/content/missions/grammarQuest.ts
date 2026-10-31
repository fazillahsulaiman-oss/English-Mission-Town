import { blank, buildMission, mc, P, pc, scene, sort, typed } from '../authoring';
import type { Mission } from '../../engine/types';

const C = 'grammar-quest' as const;
const skill = 'Writing' as const;
const FIT = 'Choose the word that fits.';

export const GRAMMAR_QUEST: Mission[] = [
  buildMission(
    { id: 'gq-y1-m1', categoryId: C, yearLevel: 1, order: 1, title: 'A or An?', blurb: 'Solve the mystery of "a" and "an".', skill, objective: 'Use the articles "a" and "an" correctly with singular nouns.' },
    [
      blank(FIT, 'I have ___ apple.', ['a', 'an'], ['an'], 'Say "apple". Does it start with a, e, i, o or u?', 'We say "an apple" because "apple" starts with a vowel sound.', { image: 'apple' }),
      blank(FIT, 'This is ___ cat.', ['a', 'an'], ['a'], 'Does "cat" start with a vowel sound?', 'We say "a cat" because "cat" starts with a consonant sound.', { image: 'cat' }),
      blank(FIT, 'She eats ___ egg.', ['a', 'an'], ['an'], '"egg" starts with "e".', 'We say "an egg".', { image: 'egg' }),
      sort('Sort the words: "a" or "an"?', ['a', 'an'], [['ball', 'a', 'ball'], ['book', 'a', 'book'], ['kite', 'a', 'kite'], ['orange', 'an', 'orange'], ['umbrella', 'an', 'umbrella'], ['elephant', 'an', 'elephant']], 'Vowel sounds: a, e, i, o, u.', 'Orange, umbrella and elephant start with vowel sounds, so we use "an".'),
      mc('Which one is correct?', 'an umbrella', ['a umbrella', 'umbrella an'], '"umbrella" starts with "u".', 'We say "an umbrella".', { image: 'umbrella' }),
      blank(FIT, 'There is ___ bird in the tree.', ['a', 'an'], ['a'], '"bird" starts with "b".', 'We say "a bird".', { image: 'bird' }),
      mc('Ravi has ___ ice cream.', 'an', ['a'], '"ice" starts with "i".', 'We say "an ice cream" because "ice" starts with a vowel sound.', { image: 'icecream' }),
      blank('Choose the words that fit.', 'I see ___ owl and ___ duck.', ['an', 'a', 'a', 'an'], ['an', 'a'], 'Check the first sound of "owl" and "duck".', '"an owl" (vowel sound) and "a duck" (consonant sound).'),
    ],
  ),
  buildMission(
    { id: 'gq-y1-m2', categoryId: C, yearLevel: 1, order: 2, title: 'One or Many?', blurb: 'Count the clues: singular and plural.', skill, objective: 'Recognise and use regular singular and plural nouns.' },
    [
      pc('Find "three cats".', P('three cats', 'cat*3'), [P('one cat', 'cat'), P('two cats', 'cat*2'), P('three dogs', 'dog*3')], 'Count them. Check the animal too.', 'Three cats means 3 cats. We add -s for more than one.'),
      blank(FIT, 'I have two ___.', ['balls', 'ball'], ['balls'], 'Two means more than one.', 'For more than one, we add -s: two balls.', { image: 'ball*2' }),
      mc('one book, two ___', 'books', ['book', 'bookes'], 'Add one letter.', 'We add -s: one book, two books.', { image: 'book*2' }),
      sort('One or more than one?', ['One', 'More than one'], [['a cat', 'One'], ['an apple', 'One'], ['a bus', 'One'], ['two dogs', 'More than one'], ['five pencils', 'More than one'], ['three birds', 'More than one']], '"a" and "an" mean one.', '"a" or "an" means one. Numbers and -s show more than one.'),
      blank(FIT, 'There is one ___ on the table.', ['cup', 'cups'], ['cup'], '"one" means just one.', 'One cup: no -s.', { image: 'cup' }),
      mc('one box, two ___', 'boxes', ['boxs', 'box'], 'Words ending in -x add -es.', 'We add -es to "box": boxes.', { image: 'box*2' }),
      pc('Which picture shows "two apples"?', P('two apples', 'apple*2'), [P('one apple', 'apple'), P('three apples', 'apple*3'), P('two bananas', 'banana*2')], 'Count, and check the fruit.', 'Two apples means 2 apples.'),
      blank(FIT, 'Look at the ___! They are flying.', ['birds', 'bird'], ['birds'], '"They" means more than one.', '"They" tells us there is more than one bird.', { image: 'bird*3' }),
    ],
  ),
  buildMission(
    { id: 'gq-y1-m3', categoryId: C, yearLevel: 1, order: 3, title: 'He, She, It, They', blurb: 'Find the right pronoun.', skill, objective: 'Use subject pronouns I, he, she, it and they.' },
    [
      mc('Aina is my friend. ___ is kind.', 'She', ['He', 'It', 'They'], 'Aina is a girl.', 'We use "She" for one girl or woman.'),
      mc('Ravi is in Year 1. ___ likes football.', 'He', ['She', 'It', 'They'], 'Ravi is a boy.', 'We use "He" for one boy or man.'),
      mc('The cat is hungry. ___ wants fish.', 'It', ['He', 'She', 'They'], 'We are talking about one animal or thing.', 'We usually use "It" for one animal or thing.', { image: 'cat' }),
      mc('Siti and Mei Ling are sisters. ___ are happy.', 'They', ['She', 'He', 'It'], 'Two people.', 'We use "They" for more than one person.'),
      sort('He, she or it?', ['He', 'She', 'It'], [['my father', 'He'], ['my uncle', 'He'], ['my mother', 'She'], ['my aunt', 'She'], ['the ball', 'It'], ['the tree', 'It']], 'Is it a man, a woman or a thing?', 'Father and uncle: he. Mother and aunt: she. Ball and tree: it.'),
      blank(FIT, 'This is my brother. ___ is ten.', ['He', 'She', 'It'], ['He'], 'A brother is a boy.', 'We use "He" for a brother.'),
      mc('___ am seven years old.', 'I', ['You', 'He', 'They'], 'Which word goes with "am"?', 'We say "I am".'),
      blank(FIT, 'My dog is brown. ___ has a long tail.', ['It', 'They', 'She'], ['It'], 'One animal.', 'We usually use "It" for one animal.', { image: 'dog' }),
    ],
  ),
  buildMission(
    { id: 'gq-y2-m1', categoryId: C, yearLevel: 2, order: 1, title: 'Am, Is, Are', blurb: 'Unlock the forms of "be".', skill, objective: 'Use am, is and are correctly with subjects.' },
    [
      blank(FIT, 'I ___ happy.', ['am', 'is', 'are'], ['am'], 'Which word always goes with "I"?', 'We say "I am".'),
      blank(FIT, 'The children ___ in the classroom.', ['am', 'is', 'are'], ['are'], '"children" means more than one child.', 'We use "are" for more than one.'),
      blank(FIT, 'My mother ___ a teacher.', ['am', 'is', 'are'], ['is'], 'One person, not "I" or "you".', 'We use "is" for one person: she is.'),
      sort('Is or are? Put each sentence in a group.', ['is', 'are'], [['The bag ___ heavy.', 'is'], ['It ___ sunny.', 'is'], ['Ravi ___ tall.', 'is'], ['The bags ___ heavy.', 'are'], ['We ___ ready.', 'are'], ['You ___ kind.', 'are']], 'One thing: is. More than one, or "you": are.', 'One: "is". More than one, "we" and "you": "are".'),
      mc('Choose the correct sentence.', 'They are my friends.', ['They is my friends.', 'They am my friends.', 'They be my friends.'], '"They" means more than one.', 'We say "They are".'),
      blank(FIT, 'You ___ my best friend.', ['am', 'is', 'are'], ['are'], 'Which word goes with "you"?', 'We always say "you are".'),
      mc('"The dog are sleeping." Change "are" to:', 'is', ['am', 'be'], 'There is one dog.', 'One dog: "The dog is sleeping."', { image: 'dog' }),
      blank(FIT, 'There ___ three mangoes on the table.', ['is', 'are'], ['are'], 'Three means more than one.', 'We say "There are" for more than one.'),
    ],
  ),
  buildMission(
    { id: 'gq-y2-m2', categoryId: C, yearLevel: 2, order: 2, title: 'Has, Have and Doing Words', blurb: 'Crack the simple present code.', skill, objective: 'Use has/have and simple present verb forms with he, she and it.' },
    [
      mc('She ___ a blue bag.', 'has', ['have', 'having'], 'With "she", we use the word ending in -s.', 'We say "she has".', { image: 'bag:blue' }),
      blank(FIT, 'I ___ two brothers.', ['have', 'has'], ['have'], 'Which word goes with "I"?', 'We say "I have".'),
      blank(FIT, 'Danial ___ football every Saturday.', ['plays', 'play', 'playing'], ['plays'], 'Danial is one person.', 'For he, she or one person, we add -s: Danial plays.', { image: 'act:football' }),
      sort('Has or have?', ['has', 'have'], [['My cat ___ green eyes.', 'has'], ['Ravi ___ a new bicycle.', 'has'], ['She ___ long hair.', 'has'], ['We ___ a big garden.', 'have'], ['They ___ lunch at noon.', 'have'], ['I ___ a red pen.', 'have']], 'He, she, it and one thing: has.', 'One person or thing: "has". I, we, you, they: "have".'),
      mc('Choose the correct sentence.', 'My sister reads every night.', ['My sister read every night.', 'My sister reading every night.', 'My sister reades every night.'], 'One person, every night.', 'For one person, add -s: reads.'),
      blank(FIT, 'The birds ___ in the morning.', ['sing', 'sings'], ['sing'], '"birds" means more than one.', 'More than one bird: "sing" with no -s.', { image: 'bird*2' }),
      mc('Which word is wrong? "He eat rice every day."', 'eat', ['He', 'rice', 'day'], 'Look at the doing word.', 'It should be "He eats rice every day."'),
      blank(FIT, 'Mum ___ teh tarik every morning.', ['drinks', 'drink', 'drinking'], ['drinks'], 'Mum is one person.', '"Mum drinks" — one person, add -s.', { image: 'cup' }),
    ],
  ),
  buildMission(
    { id: 'gq-y2-m3', categoryId: C, yearLevel: 2, order: 3, title: 'In, On, Under', blurb: 'Find hidden things with position words.', skill, objective: 'Use prepositions of place: in, on, under, next to, behind and in front of.' },
    [
      blank('Look at the picture. Choose the word.', 'The cat is ___ the table.', ['under', 'on', 'in'], ['under'], 'Is the cat above or below the table?', 'The cat is under the table.', { image: scene('cat', 'under', 'table') }),
      blank('Look at the picture. Choose the word.', 'The ball is ___ the box.', ['in', 'on', 'under'], ['in'], 'Is it inside?', 'The ball is in the box.', { image: scene('ball', 'in', 'box') }),
      blank('Look at the picture. Choose the word.', 'The book is ___ the bed.', ['on', 'under', 'in'], ['on'], 'Is it on top?', 'The book is on the bed.', { image: scene('book', 'on', 'bed') }),
      pc('Which picture shows "The bird is next to the tree"?', P('bird next to the tree', scene('bird', 'next to', 'tree')), [P('bird in the tree', scene('bird', 'in', 'tree')), P('bird under the tree', scene('bird', 'under', 'tree')), P('cat next to the tree', scene('cat', 'next to', 'tree'))], '"Next to" means beside.', 'The bird is beside the tree.'),
      blank('Look at the picture. Choose the word.', 'The dog is ___ the car.', ['behind', 'under', 'on'], ['behind'], 'We can only see part of the dog.', 'The dog is behind the car.', { image: scene('dog', 'behind', 'car') }),
      mc('I keep my books ___ my school bag.', 'in', ['on', 'under'], 'The books go inside.', 'Books go inside the bag: "in my school bag".'),
      blank('Look at the picture. Choose the word.', 'The hat is ___ the chair.', ['on', 'under', 'behind'], ['on'], 'Is it on the seat?', 'The hat is on the chair.', { image: scene('hat', 'on', 'chair') }),
      mc('Choose the sentence that matches the picture.', 'The duck is in front of the box.', ['The duck is behind the box.', 'The duck is in the box.', 'The duck is on the box.'], 'Can you see all of the duck?', 'The duck is in front of the box, closer to us.', { image: scene('duck', 'in front of', 'box') }),
    ],
  ),
  buildMission(
    { id: 'gq-y3-m1', categoryId: C, yearLevel: 3, order: 1, title: 'Past Tense Detectives', blurb: 'Solve what happened yesterday.', skill, objective: 'Use the simple past tense of regular and common irregular verbs.' },
    [
      mc('Yesterday, I ___ my grandmother.', 'visited', ['visit', 'visiting', 'visits'], '"Yesterday" means it already happened.', 'For the past, add -ed: visited.'),
      blank(FIT, 'Last night, we ___ a film.', ['watched', 'watch', 'watches'], ['watched'], '"Last night" is in the past.', 'Watch → watched.'),
      sort('Is the doing word in the present or the past?', ['Present', 'Past'], [['plays', 'Present'], ['eats', 'Present'], ['swims', 'Present'], ['jumped', 'Past'], ['cooked', 'Past'], ['went', 'Past']], 'Many past words end in -ed. Some change spelling.', 'Jumped, cooked and went are past. Plays, eats and swims are present.'),
      mc('What is the past tense of "go"?', 'went', ['goed', 'goes', 'going'], 'This one does not use -ed.', '"go" is irregular: go → went.'),
      blank(FIT, 'Mei Ling ___ a letter to her friend last week.', ['wrote', 'writes', 'write'], ['wrote'], '"last week" is in the past.', 'write → wrote.'),
      mc('Choose the correct sentence.', 'We ate satay at the night market last Friday.', ['We eat satay at the night market last Friday.', 'We eated satay at the night market last Friday.', 'We eating satay at the night market last Friday.'], '"last Friday" is past. "eat" is irregular.', 'eat → ate.'),
      typed('Type the past tense.', 'Today I play. Yesterday I ___.', [['played']], 'Add two letters.', 'play → played.'),
      mc('"Ravi buyed a new kite yesterday." How should we fix it?', 'buyed → bought', ['Ravi → Ravis', 'new → newer', 'yesterday → today'], 'Which doing word is wrong?', 'buy → bought. "Ravi bought a new kite yesterday."'),
    ],
  ),
  buildMission(
    { id: 'gq-y3-m2', categoryId: C, yearLevel: 3, order: 2, title: 'Plurals and Quantities', blurb: 'Count and measure the clues.', skill, objective: 'Use regular and irregular plurals, and many/much with countable and uncountable nouns.' },
    [
      mc('one child, two ___', 'children', ['childs', 'childrens', 'child'], 'This plural does not use -s.', 'child → children.'),
      blank(FIT, 'There are many ___ in the box.', ['toys', 'toies', 'toy'], ['toys'], 'A vowel comes before the "y".', 'toy → toys. We just add -s.'),
      sort('Add -s or -es?', ['add -s', 'add -es'], [['book', 'add -s'], ['pencil', 'add -s'], ['kite', 'add -s'], ['bus', 'add -es'], ['watch', 'add -es'], ['dish', 'add -es']], 'Words ending in s, ch, sh or x add -es.', 'bus → buses, watch → watches, dish → dishes.'),
      typed('Type the plural.', 'one baby, two ___', [['babies']], 'Change the "y" to "i" first.', 'baby → babies.'),
      mc('How ___ apples do you have?', 'many', ['much', 'more'], 'We can count apples.', 'We use "many" for things we can count.'),
      mc('How ___ water is in the bottle?', 'much', ['many', 'few'], 'We cannot count water one by one.', 'We use "much" for things we cannot count.'),
      blank(FIT, 'There ___ some milk in the fridge.', ['is', 'are'], ['is'], 'Can you count milk?', 'Milk is uncountable, so we say "There is some milk".'),
      mc('Choose the correct sentence.', 'The mice are under the bed.', ['The mouses are under the bed.', 'The mice is under the bed.', 'The mices are under the bed.'], 'mouse → ?', 'mouse → mice, and more than one takes "are".'),
    ],
  ),
  buildMission(
    { id: 'gq-y3-m3', categoryId: C, yearLevel: 3, order: 3, title: 'Joining and Comparing', blurb: 'Compare and connect the clues.', skill, objective: 'Use conjunctions (and, but, so, because) and comparative/superlative adjectives.' },
    [
      blank(FIT, 'I stayed at home ___ I was sick.', ['because', 'so', 'but'], ['because'], 'Being sick is the reason.', '"because" gives a reason.'),
      blank(FIT, 'The elephant is ___ than the dog.', ['bigger', 'big', 'biggest'], ['bigger'], '"than" compares two things.', 'With "than", use the -er word: bigger.'),
      mc('Mount Kinabalu is the ___ mountain in Malaysia.', 'highest', ['higher', 'high', 'most high'], 'It is number one of all the mountains.', 'For the top of a group, use "the ...-est": the highest.'),
      sort('Which joining word fits best?', ['and', 'but', 'because'], [['I like durians ___ rambutans.', 'and'], ['We sing ___ dance.', 'and'], ['I want to play, ___ it is raining.', 'but'], ['She is small ___ strong.', 'but'], ['I wear a jacket ___ it is cold.', 'because'], ['He is tired ___ he ran far.', 'because']], '"and" adds, "but" shows a difference, "because" gives a reason.', 'and = adding, but = different, because = reason.'),
      mc('A cheetah runs ___ than a turtle.', 'faster', ['fast', 'fastest', 'more fast'], 'Comparing two animals with "than".', '"faster than" compares two things.'),
      typed('Type the correct word. Use "small".', 'This box is small. That box is ___.', [['smaller', 'even smaller']], 'Add -er to compare.', 'small → smaller.'),
      mc('Which sentence is correct?', 'Aina is taller than her brother.', ['Aina is more tall than her brother.', 'Aina is tallest than her brother.', 'Aina is taller then her brother.'], 'Watch out for "than" and "then".', '"taller than" is correct. "then" is about time.'),
      blank('Choose the joining words.', 'We could not go out ___ it was raining, ___ we played board games.', ['because', 'so', 'but'], ['because', 'so'], 'First a reason, then a result.', '"because" gives the reason. "so" gives the result.'),
    ],
  ),
];
