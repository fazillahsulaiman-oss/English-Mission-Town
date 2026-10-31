import { blank, buildMission, gloss, match, order, P, scene, sort, storyQ } from '../authoring';
import type { Mission } from '../../engine/types';

const C = 'story-adventure' as const;
const skill = 'Reading' as const;
const SEQ = 'Put the story events in order.';
const COMPLETE = 'Complete the sentence from the story.';

export const STORY_ADVENTURE: Mission[] = [
  buildMission(
    { id: 'sa-y1-m1', categoryId: C, yearLevel: 1, order: 1, title: 'Oyen and the Park', blurb: 'Two short stories about a cat and a kite.', skill, objective: 'Understand short texts and find simple details (who, what, where).' },
    [
      storyQ('y1-oyen', "What is the cat's name?", 'Oyen', ['Aina', 'Ravi', 'Tom'], 'Read the third sentence.', 'The cat\'s name is Oyen. Aina is the girl.'),
      storyQ('y1-oyen', 'What does Oyen like?', P('fish'), [P('apple'), P('bread'), P('milk')], 'Find the word "likes".', 'Oyen likes fish.', { labels: false }),
      storyQ('y1-oyen', 'Where does Oyen sleep?', P('under the table', scene('cat', 'under', 'table')), [P('on the table', scene('cat', 'on', 'table')), P('on the bed', scene('cat', 'on', 'bed')), P('in the box', scene('cat', 'in', 'box'))], 'Find the word "sleeps".', 'Oyen sleeps under the table.', { labels: false }),
      blank(COMPLETE, 'The cat is ___.', ['orange', 'blue', 'green'], ['orange'], 'What colour is the cat?', 'The story says "The cat is orange."', { storyId: 'y1-oyen' }),
      storyQ('y1-park', 'Where does Ravi go?', 'to the park', ['to school', 'to the shop', 'to the beach'], 'Read the first sentence.', 'Ravi goes to the park.'),
      storyQ('y1-park', 'What colour is the kite?', P('red kite', 'kite:red'), [P('blue kite', 'kite:blue'), P('yellow kite', 'kite:yellow'), P('green kite', 'kite:green')], 'Find the word "kite".', 'The kite is red.', { labels: false }),
      match('Match each sentence to its picture.', [['He sees a big tree.', P('tree')], ['He sees a red kite.', P('kite', 'kite:red')], ['Ravi runs.', P('run', 'act:run')]], 'Look for the key word in each sentence.', 'Tree, kite and running all happen in the story.', { storyId: 'y1-park' }),
      storyQ('y1-park', 'How does Ravi feel?', P('happy', 'face:happy'), [P('sad', 'face:sad'), P('angry', 'face:angry'), P('tired', 'face:tired')], 'Read the last sentence.', 'Ravi is happy. He runs and laughs.', { labels: true }),
    ],
  ),
  buildMission(
    { id: 'sa-y1-m2', categoryId: C, yearLevel: 1, order: 2, title: 'Bags and Rain', blurb: 'Read about a school bag and a rainy day.', skill, objective: 'Understand short texts and identify objects, people and events.' },
    [
      storyQ('y1-bag', "Which bag is Mei Ling's?", P('blue bag', 'bag:blue'), [P('red bag', 'bag:red'), P('green bag', 'bag:green'), P('pink bag', 'bag:pink')], 'Read the first sentence.', 'Mei Ling has a blue bag.', { labels: false }),
      sort('What is in the bag? Sort the things.', ['In the bag', 'Not in the bag'], [['book', 'In the bag', 'book'], ['pencil', 'In the bag', 'pencil'], ['apple', 'In the bag', 'apple'], ['ball', 'Not in the bag', 'ball'], ['hat', 'Not in the bag', 'hat']], 'Read the second sentence again.', 'The bag has a book, a pencil and an apple.', { storyId: 'y1-bag' }),
      storyQ('y1-bag', 'When does Mei Ling eat the apple?', 'at recess', ['at night', 'at the park', 'on the bus'], 'Read the last sentence.', 'She eats the apple at recess.'),
      blank(COMPLETE, 'Mei Ling eats the ___.', ['apple', 'book', 'pencil'], ['apple'], 'What can you eat?', 'She eats the apple.', { storyId: 'y1-bag' }),
      storyQ('y1-rain', 'What is the weather like?', P('rainy', 'rain'), [P('sunny', 'sun'), P('windy', 'windy'), P('rainbow', 'rainbow')], 'Read the first sentence.', 'It is raining.', { labels: false }),
      storyQ('y1-rain', "Which umbrella is Danial's?", P('yellow umbrella', 'umbrella:yellow'), [P('red umbrella', 'umbrella:red'), P('blue umbrella', 'umbrella:blue'), P('green umbrella', 'umbrella:green')], 'Find the word "umbrella".', 'Danial has a yellow umbrella.', { labels: false }),
      storyQ('y1-rain', 'Who walks with Danial?', 'his mother', ['his father', 'his sister', 'his teacher'], 'Find the word "with".', 'He walks to school with his mother.'),
      order(SEQ, ['It is raining.', 'Danial takes his umbrella.', 'He walks to school.'], 'What happens first in the story?', 'Rain, then the umbrella, then the walk to school.', { kind: 'sequence', storyId: 'y1-rain' }),
    ],
  ),
  buildMission(
    { id: 'sa-y1-m3', categoryId: C, yearLevel: 1, order: 3, title: 'Ducks and Birthdays', blurb: 'A duck at the pond and a birthday party.', skill, objective: 'Understand short texts, sequence events and make a simple inference.' },
    [
      storyQ('y1-duck', 'Where does the duck live?', 'near the pond', ['in the school', 'in a tree', 'in a box'], 'Read the first sentence.', 'The duck lives near the pond.'),
      storyQ('y1-duck', 'What can the duck do?', 'swim', ['fly far', 'read', 'sing'], 'Be careful: the duck cannot fly far.', 'The duck can swim, but it cannot fly far.'),
      storyQ('y1-duck', 'What does Siti give the duck?', P('bread'), [P('rice'), P('banana'), P('cake')], 'Find the name "Siti".', 'Siti gives the duck some bread.', { labels: false }),
      blank(COMPLETE, 'Every ___, Siti gives the duck some bread.', ['morning', 'night', 'Sunday'], ['morning'], 'When does Siti visit?', '"Every morning" — each day in the morning.', { storyId: 'y1-duck' }),
      storyQ('y1-birthday', 'How old is Hafiz?', 'seven', ['six', 'eight', 'ten'], 'Read the second sentence.', 'Hafiz is seven.'),
      storyQ('y1-birthday', 'What does Mum make?', P('cake'), [P('noodles'), P('bread'), P('ice cream', 'icecream')], 'Find the word "Mum".', 'Mum makes a big cake.', { labels: false }),
      order(SEQ, ['Mum makes a cake.', 'His friends sing a song.', 'Hafiz blows out the candles.', 'Everyone claps.'], 'What happens first at the party?', 'Cake, song, candles, then clapping.', { kind: 'sequence', storyId: 'y1-birthday' }),
      storyQ('y1-birthday', 'Why do his friends sing a song?', "It is Hafiz's birthday.", ['It is raining.', 'It is a school day.', 'Hafiz is sad.'], 'What special day is it?', 'Friends sing because it is Hafiz\'s birthday.'),
    ],
  ),
  buildMission(
    { id: 'sa-y2-m1', categoryId: C, yearLevel: 2, order: 1, title: 'The Night Market', blurb: 'An evening adventure with Kavitha.', skill, objective: 'Understand a short narrative: find details, sequence events and infer feelings.' },
    [
      storyQ('y2-market', 'When does Kavitha go to the night market?', 'on Friday evening', ['on Sunday morning', 'on Friday morning', 'after school on Monday'], 'Read the first sentence.', 'She goes on Friday evening.'),
      storyQ('y2-market', 'Who goes with Kavitha?', 'her father', ['her mother', 'her brother', 'her friend'], 'Find the word "with".', 'She goes with her father.'),
      sort('What did they buy? Sort the food.', ['They bought it', 'Not in the story'], [['satay', 'They bought it'], ['corn', 'They bought it'], ['oranges', 'They bought it', 'orange'], ['fish', 'Not in the story', 'fish'], ['bread', 'Not in the story', 'bread']], 'Read the third sentence.', 'They bought satay, corn and oranges.', { storyId: 'y2-market' }),
      storyQ('y2-market', 'Which balloon does Kavitha choose?', 'a pink balloon', ['a red balloon', 'a blue balloon', 'a yellow balloon'], 'Find the word "chooses".', 'She chooses a pink one.'),
      storyQ('y2-market', 'What is the market like?', 'busy and bright', ['quiet and dark', 'small and empty', 'cold and wet'], 'Read the second sentence.', 'The market is busy and bright.'),
      order(SEQ, ['Kavitha and her father go to the night market.', 'They buy satay, corn and oranges.', 'Kavitha chooses a pink balloon.', 'The balloon floats above her head on the way home.'], 'Use the order of the story.', 'Go, buy food, choose a balloon, then go home.', { kind: 'sequence', storyId: 'y2-market' }),
      blank(COMPLETE, 'Kavitha ___ her father for a lovely evening.', ['thanks', 'sells', 'asks'], ['thanks'], 'Read the last sentence.', 'She thanks her father.', { storyId: 'y2-market' }),
      storyQ('y2-market', 'How does Kavitha feel at the end?', 'happy', ['angry', 'scared', 'bored'], 'She says it was a "lovely evening".', '"Lovely evening" tells us she is happy.'),
    ],
  ),
  buildMission(
    { id: 'sa-y2-m2', categoryId: C, yearLevel: 2, order: 2, title: 'The Lost Pencil Case', blurb: 'Help Wei Jie solve a mystery.', skill, objective: 'Find specific information, sequence events and understand reasons in a narrative.' },
    [
      storyQ('y2-pencilcase', "What can't Wei Jie find?", 'his pencil case', ['his bag', 'his book', 'his desk'], 'Read the first sentence.', 'He cannot find his pencil case.'),
      storyQ('y2-pencilcase', 'Where does he look first?', 'in his bag', ['under his desk', 'in the library', 'in the canteen'], 'Find the first place he looks.', 'He looks in his bag first.'),
      storyQ('y2-pencilcase', 'Who helps Wei Jie?', 'Nurul', ['Siti', 'Ravi', 'his teacher'], 'Find the word "helps".', 'His friend Nurul helps him.'),
      storyQ('y2-pencilcase', 'Where is the pencil case?', 'on a table near the window', ['under a chair', 'in his bag', 'next to the door'], 'Look for the exclamation mark (!).', 'It is on a table near the window in the library.'),
      order(SEQ, ['Wei Jie looks in his bag.', 'He looks under his desk.', 'Wei Jie and Nurul walk to the library.', 'They find the pencil case.'], 'Where does he look first?', 'Bag, desk, library, then found.', { kind: 'sequence', storyId: 'y2-pencilcase' }),
      storyQ('y2-pencilcase', 'Why was the pencil case in the library?', 'He forgot it after reading time.', ['Nurul hid it there.', 'The teacher took it.', 'A cat carried it there.'], 'Find the word "forgot".', 'Wei Jie forgot it after reading time.'),
      blank(COMPLETE, "Wei Jie says, 'Thank you, ___!'", ['Nurul', 'Siti', 'Teacher'], ['Nurul'], 'Who helped him?', 'He thanks Nurul.', { storyId: 'y2-pencilcase' }),
      storyQ('y2-pencilcase', 'Which word best describes Nurul?', 'helpful', ['lazy', 'rude', 'sleepy'], 'What does Nurul do for Wei Jie?', 'Nurul helps her friend, so she is helpful.', { glossary: [gloss('helpful', null, 'happy to help other people', 'My helpful brother carries my bag.', true)] }),
    ],
  ),
  buildMission(
    { id: 'sa-y2-m3', categoryId: C, yearLevel: 2, order: 3, title: "Grandmother's Garden", blurb: 'A Saturday visit to the village.', skill, objective: 'Find details about people, places and events, and understand the writer\'s opinion.' },
    [
      storyQ('y2-garden', 'When does Arjun visit his grandmother?', 'every Saturday', ['every Sunday', 'every morning', 'once a year'], 'Read the first sentence.', 'He visits every Saturday.'),
      storyQ('y2-garden', 'Where is the garden?', 'behind her house', ['in front of her house', 'at school', 'next to the river'], 'Find the word "garden".', 'The garden is behind her house.'),
      sort('What is in the garden?', ['In the garden', 'Not in the story'], [['chillies', 'In the garden'], ['bananas', 'In the garden', 'banana'], ['flowers', 'In the garden', 'flower'], ['apples', 'Not in the story', 'apple'], ['watermelons', 'Not in the story', 'watermelon']], 'Read the third sentence.', 'There are chillies, bananas and flowers.', { storyId: 'y2-garden' }),
      storyQ('y2-garden', 'What does Arjun use to water the plants?', 'a green watering can', ['a red bucket', 'a blue cup', 'a yellow hose'], 'Find the word "waters".', 'He uses a green watering can.'),
      blank(COMPLETE, 'Grandmother picks some ___ for him.', ['bananas', 'chillies', 'flowers'], ['bananas'], 'What do they eat later?', 'She picks bananas.', { storyId: 'y2-garden' }),
      order(SEQ, ['Arjun visits his grandmother.', 'Arjun waters the plants.', 'Grandmother picks some bananas.', 'They eat banana fritters.'], 'What happens when he arrives?', 'Visit, water, pick bananas, eat together.', { kind: 'sequence', storyId: 'y2-garden' }),
      storyQ('y2-garden', 'What do they eat together?', 'banana fritters', ['fried rice', 'chilli sauce', 'banana cake'], 'Find the word "eat".', 'They eat banana fritters.'),
      storyQ('y2-garden', 'What does Arjun think about Saturday?', 'It is the best day of the week.', ['It is a boring day.', 'It is too hot.', 'It is a school day.'], 'Read the last sentence.', 'Arjun thinks Saturday is the best day of the week.'),
    ],
  ),
  buildMission(
    { id: 'sa-y3-m1', categoryId: C, yearLevel: 3, order: 1, title: 'The Hornbill Visitor', blurb: 'A surprise visitor at school.', skill, objective: 'Understand a narrative: find details, understand reasons and sequence events.' },
    [
      storyQ('y3-hornbill', 'Where was the bird sitting?', 'on the mango tree', ['on the classroom roof', "on Teacher Lim's desk", 'in the school field'], 'Read the second sentence.', 'It was sitting on the mango tree.'),
      storyQ('y3-hornbill', 'What colours was its beak?', 'yellow and red', ['black and white', 'green and blue', 'orange and brown'], 'Find the word "beak".', 'The beak was yellow and red.'),
      storyQ('y3-hornbill', 'Where do hornbills live?', 'in the rainforest', ['in the desert', 'in the sea', 'in the city'], 'What did Teacher Lim explain?', 'Hornbills live in the rainforest.'),
      storyQ('y3-hornbill', 'Why did the pupils watch quietly?', 'so they would not frighten it', ['because they were sleepy', 'because Teacher Lim was angry', 'so they could catch it'], 'Find the word "quietly".', 'They were quiet so they would not frighten the bird.'),
      order(SEQ, ['The pupils heard a loud call.', 'Teacher Lim said it was a hornbill.', 'The hornbill flew away.', 'Everyone drew a picture of the bird.'], 'What happened first that morning?', 'Call, hornbill, flew away, drawing.', { kind: 'sequence', storyId: 'y3-hornbill' }),
      blank(COMPLETE, 'After ___ minutes, the hornbill flew away.', ['ten', 'two', 'twenty'], ['ten'], 'Find "minutes".', 'After ten minutes, it flew away.', { storyId: 'y3-hornbill' }),
      storyQ('y3-hornbill', 'What did everyone do that afternoon?', 'They drew a picture of the bird.', ['They fed the bird.', 'They went to the rainforest.', 'They wrote a letter to the bird.'], 'Find "That afternoon".', 'Everyone drew a picture of the bird.'),
      storyQ('y3-hornbill', 'How did Priya feel about the day?', 'It was special.', ['It was boring.', 'It was scary.', 'It was too long.'], 'Read what Priya wrote.', 'Priya wrote that it was a special day.'),
    ],
  ),
  buildMission(
    { id: 'sa-y3-m2', categoryId: C, yearLevel: 3, order: 2, title: 'Sports Day Surprise', blurb: 'Run the relay with Daniel.', skill, objective: 'Understand feelings, reasons, sequence and the main message of a story.' },
    [
      storyQ('y3-sportsday', 'Which event was Daniel in?', 'the relay race', ['the long jump', 'the high jump', 'the sack race'], 'Read the second sentence.', 'Daniel was in the relay race.'),
      storyQ('y3-sportsday', 'Why was Daniel nervous?', 'He was the last runner.', ['He was the first runner.', 'He was sick.', 'He lost his shoes.'], 'Find the word "because".', 'He was nervous because he was the last runner.'),
      storyQ('y3-sportsday', 'Which place was his team in when he got the baton?', 'third', ['first', 'second', 'last'], 'Find the word "baton".', 'His team was in third place.'),
      storyQ('y3-sportsday', 'How many runners did Daniel pass?', 'two', ['one', 'three', 'none'], '"one runner, then another".', 'He passed one runner, then another: two runners.'),
      order(SEQ, ['Daniel got the baton.', 'He passed two runners.', "Daniel's team finished first.", 'The teacher gave them gold medals.'], 'What happened when the baton came?', 'Baton, passing, finishing first, medals.', { kind: 'sequence', storyId: 'y3-sportsday' }),
      blank(COMPLETE, 'The crowd ___ loudly.', ['cheered', 'cried', 'slept'], ['cheered'], 'What do people do at an exciting race?', 'The crowd cheered loudly.', { storyId: 'y3-sportsday' }),
      storyQ('y3-sportsday', 'What did the teacher give each of them?', 'a gold medal', ['a silver medal', 'a trophy', 'new shoes'], 'Find the word "medal".', 'The teacher gave each of them a gold medal.'),
      storyQ('y3-sportsday', 'What did Daniel learn?', 'Practice and teamwork can make a big difference.', ['Running is boring.', 'Only the fastest person can win.', 'Teachers like medals.'], 'Read the last sentence.', 'He learned that practice and teamwork matter.'),
    ],
  ),
  buildMission(
    { id: 'sa-y3-m3', categoryId: C, yearLevel: 3, order: 3, title: 'The Recycling Project', blurb: 'Help Siti clean up the school.', skill, objective: 'Find information, classify details and understand cause and effect in a text.' },
    [
      storyQ('y3-recycling', 'Why did the class start the project?', 'to keep their school clean', ['to win a prize', 'to buy new shoes', 'to make a garden'], 'Read the first sentence.', 'They wanted to keep their school clean.'),
      storyQ('y3-recycling', 'When did pupils bring things from home?', 'every Monday', ['every Friday', 'once a year', 'every evening'], 'Find the word "Every".', 'They brought items every Monday.'),
      sort('Which box does each item go in?', ['Blue box (paper)', 'Orange box (plastic)', 'Grey box (cans)'], [['old newspaper', 'Blue box (paper)'], ['magazine', 'Blue box (paper)'], ['plastic bottle', 'Orange box (plastic)'], ['plastic cup', 'Orange box (plastic)'], ['tin can', 'Grey box (cans)'], ['drink can', 'Grey box (cans)']], 'Read which colour is for which material.', 'Blue for paper, orange for plastic, grey for cans.', { storyId: 'y3-recycling' }),
      storyQ('y3-recycling', 'Which box was for plastic?', 'the orange box', ['the blue box', 'the grey box', 'the green box'], 'Find the word "plastic" near the colours.', 'The orange box was for plastic.'),
      blank(COMPLETE, 'They sold everything to a recycling ___.', ['centre', 'market', 'school'], ['centre'], 'Find "recycling" near the end.', 'They sold everything to a recycling centre.', { storyId: 'y3-recycling' }),
      storyQ('y3-recycling', 'What did they buy with the money?', 'new storybooks', ['new uniforms', 'a football', 'plastic bottles'], 'Find the word "money".', 'They bought new storybooks for the class library.'),
      order(SEQ, ['The class started a recycling project.', 'Pupils brought items every Monday.', 'The class sold everything.', 'They bought new storybooks.'], 'What happened first?', 'Start, collect, sell, buy books.', { kind: 'sequence', storyId: 'y3-recycling' }),
      storyQ('y3-recycling', 'Why did Siti feel proud?', 'A small idea helped the whole school.', ['She sold the most bottles.', 'She got a new book for herself.', 'Her teacher gave her money.'], 'Find the word "proud".', 'She was proud because a small idea helped everyone.'),
    ],
  ),
];
