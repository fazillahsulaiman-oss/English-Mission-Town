import { blank, buildMission, gloss, listen, order, P, scene } from '../authoring';
import type { Mission } from '../../engine/types';

const C = 'listen-discover' as const;
const skill = 'Listening' as const;
const LISTEN_PIC = 'Listen. Choose the matching picture.';
const LISTEN_REPLY = 'Listen. Choose the best answer.';

export const LISTEN_DISCOVER: Mission[] = [
  buildMission(
    { id: 'ld-y1-m1', categoryId: C, yearLevel: 1, order: 1, title: 'Where Is It?', blurb: 'Listen and find where things are hiding.', skill, objective: 'Understand short spoken sentences about where things are.' },
    [
      listen('The red bag is under the chair.', LISTEN_PIC, P('red bag under the chair', scene('bag:red', 'under', 'chair')), [P('red bag on the chair', scene('bag:red', 'on', 'chair')), P('blue bag under the chair', scene('bag:blue', 'under', 'chair')), P('red bag next to the chair', scene('bag:red', 'next to', 'chair'))], 'Listen for the colour and the word "under".', 'The red bag is under the chair, below the seat.'),
      listen('The cat is on the table.', LISTEN_PIC, P('cat on the table', scene('cat', 'on', 'table')), [P('cat under the table', scene('cat', 'under', 'table')), P('dog on the table', scene('dog', 'on', 'table')), P('cat next to the table', scene('cat', 'next to', 'table'))], 'Which animal? Where is it?', 'The cat is on top of the table.'),
      listen('The ball is in the box.', LISTEN_PIC, P('ball in the box', scene('ball', 'in', 'box')), [P('ball on the box', scene('ball', 'on', 'box')), P('ball next to the box', scene('ball', 'next to', 'box')), P('apple in the box', scene('apple', 'in', 'box'))], '"In" means inside.', 'The ball is inside the box.'),
      listen('The book is on the bed.', LISTEN_PIC, P('book on the bed', scene('book', 'on', 'bed')), [P('book under the bed', scene('book', 'under', 'bed')), P('bag on the bed', scene('bag', 'on', 'bed')), P('book next to the bed', scene('book', 'next to', 'bed'))], 'Listen for the thing and the place.', 'The book is on top of the bed.'),
      listen('The green ball is next to the tree.', LISTEN_PIC, P('green ball next to the tree', scene('ball:green', 'next to', 'tree')), [P('red ball next to the tree', scene('ball:red', 'next to', 'tree')), P('green ball under the tree', scene('ball:green', 'under', 'tree')), P('green kite next to the tree', scene('kite:green', 'next to', 'tree'))], 'Listen for the colour first.', 'The green ball is beside the tree.'),
      listen('The bird is in the tree.', LISTEN_PIC, P('bird in the tree', scene('bird', 'in', 'tree')), [P('bird under the tree', scene('bird', 'under', 'tree')), P('cat in the tree', scene('cat', 'in', 'tree')), P('bird next to the tree', scene('bird', 'next to', 'tree'))], 'Which animal is it?', 'The bird is up in the tree.'),
      listen('The yellow duck is behind the box.', LISTEN_PIC, P('yellow duck behind the box', scene('duck:yellow', 'behind', 'box')), [P('yellow duck in front of the box', scene('duck:yellow', 'in front of', 'box')), P('yellow duck on the box', scene('duck:yellow', 'on', 'box')), P('chicken behind the box', scene('chicken', 'behind', 'box'))], '"Behind" means at the back.', 'The duck is behind the box, so we can only see part of it.'),
      listen('The apple is in the basket.', LISTEN_PIC, P('apple in the basket', scene('apple', 'in', 'basket')), [P('orange in the basket', scene('orange', 'in', 'basket')), P('apple next to the basket', scene('apple', 'next to', 'basket')), P('apple on the table', scene('apple', 'on', 'table'))], 'Listen for the fruit and the place.', 'The apple is inside the basket.'),
    ],
  ),
  buildMission(
    { id: 'ld-y1-m2', categoryId: C, yearLevel: 1, order: 2, title: 'Listen and Do', blurb: 'Follow simple instructions.', skill, objective: 'Understand and respond to short spoken instructions.' },
    [
      listen('Stand up, please.', LISTEN_PIC, P('stand up', 'act:stand'), [P('sit down', 'act:sit'), P('sleep', 'act:sleep'), P('swim', 'act:swim')], '"Up" means you go higher.', 'When we stand up, we get up from our chairs.'),
      listen('Draw a big yellow sun.', 'Listen. What will you draw?', P('sun'), [P('moon'), P('star'), P('cloud')], 'It is yellow and bright in the sky.', 'You will draw a yellow sun.'),
      order('Listen. Put the actions in order.', [P('Wash your hands', 'act:wash'), P('Eat your lunch', 'act:eat')], 'Listen for "First" and "Then".', 'First, wash your hands. Then, eat your lunch.', { kind: 'sequence', audio: 'First, wash your hands. Then, eat your lunch.' }),
      listen('Please give me the blue pencil.', LISTEN_PIC, P('blue pencil', 'pencil:blue'), [P('red pencil', 'pencil:red'), P('blue ruler', 'ruler:blue'), P('green pencil', 'pencil:green')], 'Listen for the colour and the thing.', 'The blue pencil is the right one.'),
      order('Listen. Put the actions in order.', [P('Put on your shoes', 'shoe'), P('Take your bag', 'bag'), P('Go to school', 'school')], 'What do you hear first?', 'First shoes, next your bag, then go to school.', { kind: 'sequence', audio: 'First, put on your shoes. Next, take your bag. Then, go to school.' }),
      listen('Jump three times!', LISTEN_PIC, P('jump', 'act:jump'), [P('run', 'act:run'), P('swim', 'act:swim'), P('sing', 'act:sing')], 'Your feet leave the ground.', 'Jump means push up off the ground with your legs.'),
      blank('Listen. Complete the sentence.', '___ your hands.', ['Clap', 'Wash', 'Open'], ['Clap'], 'Listen for the first word.', 'The sentence is "Clap your hands."', { audio: 'Clap your hands.' }),
      listen('Sit down and open your book.', 'Listen. What should you do?', P('sit down', 'act:sit'), [P('stand up', 'act:stand'), P('run', 'act:run'), P('sleep', 'act:sleep')], 'Listen for "sit".', 'You should sit down and then open your book.'),
    ],
  ),
  buildMission(
    { id: 'ld-y1-m3', categoryId: C, yearLevel: 1, order: 3, title: 'How Many? What Colour?', blurb: 'Listen for numbers and colours.', skill, objective: 'Identify specific details (numbers, colours) in short spoken sentences.' },
    [
      listen('I can see three cats.', LISTEN_PIC, P('three cats', 'cat*3'), [P('two cats', 'cat*2'), P('four cats', 'cat*4'), P('three dogs', 'dog*3')], 'Count carefully: how many?', 'There are three cats.'),
      listen('Siti has two red apples.', LISTEN_PIC, P('two red apples', 'apple:red*2'), [P('three red apples', 'apple:red*3'), P('two green apples', 'apple:green*2'), P('two oranges', 'orange*2')], 'Listen for the number and the colour.', 'Siti has two red apples.'),
      listen('My kite is orange.', LISTEN_PIC, P('orange kite', 'kite:orange'), [P('blue kite', 'kite:blue'), P('green kite', 'kite:green'), P('purple kite', 'kite:purple')], 'Listen for the colour word.', 'The kite is orange.'),
      listen('Look! A big brown dog.', LISTEN_PIC, P('dog'), [P('cat'), P('cow'), P('monkey')], 'This animal says "woof".', 'It is a big brown dog.'),
      listen('The bus is yellow.', LISTEN_PIC, P('yellow bus', 'bus:yellow'), [P('yellow car', 'car:yellow'), P('red bus', 'bus:red'), P('green bus', 'bus:green')], 'Is it a bus or a car? What colour?', 'The bus is yellow.'),
      blank('Listen. Complete the sentence.', 'I have ___ pencils.', ['five', 'four', 'nine'], ['five'], 'Listen for the number.', 'The sentence is "I have five pencils."', { audio: 'I have five pencils.' }),
      listen('It is raining today.', LISTEN_PIC, P('rain'), [P('sun'), P('windy'), P('rainbow')], 'Listen for the weather word.', 'It is raining, so water is falling from the clouds.'),
      listen('Hello! My name is Ravi. What is your name?', LISTEN_REPLY, 'My name is Aina.', ['I am seven.', 'It is red.', 'Goodbye!'], 'Ravi asks a question about your name.', 'When someone asks "What is your name?", we say "My name is ...".'),
    ],
  ),
  buildMission(
    { id: 'ld-y2-m1', categoryId: C, yearLevel: 2, order: 1, title: 'At the Market', blurb: 'Listen to shoppers at the morning market.', skill, objective: 'Identify details such as number, price and place in short spoken texts.' },
    [
      listen('Mum buys four oranges.', LISTEN_PIC, P('four oranges', 'orange*4'), [P('three oranges', 'orange*3'), P('four apples', 'apple*4'), P('four bananas', 'banana*4')], 'Which fruit? How many?', 'Mum buys four oranges.'),
      listen('The fish costs ten ringgit.', 'Listen. How much is the fish?', 'RM10', ['RM2', 'RM12', 'RM20'], 'Ten, twelve and twenty sound a little alike. Listen carefully.', 'The fish costs ten ringgit (RM10).'),
      listen('Would you like a plastic bag?', LISTEN_REPLY, 'No, thank you. I have a basket.', ['Yes, I am nine.', 'It is Monday.', 'I like blue.'], 'The question is about a bag.', 'We answer "Would you like...?" with "Yes, please" or "No, thank you".'),
      order('Listen. Put the things in the order Mei Ling buys them.', [P('bread'), P('eggs', 'egg'), P('milk')], 'Listen for "First", "Then" and "Finally".', 'First bread, then eggs, finally milk.', { kind: 'sequence', audio: 'First, Mei Ling buys bread. Then she buys eggs. Finally, she buys milk.' }),
      listen('The basket is under the table.', LISTEN_PIC, P('basket under the table', scene('basket', 'under', 'table')), [P('basket on the table', scene('basket', 'on', 'table')), P('box under the table', scene('box', 'under', 'table')), P('basket next to the table', scene('basket', 'next to', 'table'))], 'Listen for "under".', 'The basket is under the table.'),
      blank('Listen. Complete the sentence.', 'The shop opens at ___ o\'clock.', ['eight', 'nine', 'six'], ['eight'], 'Listen for the time.', 'The shop opens at eight o\'clock.', { audio: "The shop opens at eight o'clock." }),
      listen('The man is selling colourful kites.', 'Listen. What is the man selling?', P('kites', 'kite'), [P('umbrellas', 'umbrella'), P('hats', 'hat'), P('balls', 'ball')], 'They fly in the sky.', 'The man is selling kites.'),
      listen('Excuse me, where are the eggs? They are next to the milk.', 'Listen. Where are the eggs?', 'next to the milk', ['under the milk', 'next to the bread', 'in the basket'], 'Listen to the answer after the question.', 'The eggs are next to the milk.'),
    ],
  ),
  buildMission(
    { id: 'ld-y2-m2', categoryId: C, yearLevel: 2, order: 2, title: 'Daily Routines', blurb: 'Listen to what friends do every day.', skill, objective: 'Understand short spoken texts about daily routines.' },
    [
      listen("Arjun wakes up at six o'clock.", 'Listen. What time does Arjun wake up?', "six o'clock", ["seven o'clock", "eight o'clock", "nine o'clock"], 'Listen for the number.', "Arjun wakes up at six o'clock."),
      listen('After school, Nurul plays badminton with her brother.', 'Listen. What does Nurul do after school?', P('play badminton', 'act:badminton'), [P('play football', 'act:football'), P('swim', 'act:swim'), P('ride a bicycle', 'act:cycle')], 'Listen for the sport.', 'Nurul plays badminton.'),
      order('Listen. Put the actions in order.', [P('Brush teeth', 'act:brush'), P('Eat breakfast', 'act:eat'), P('Go to school', 'school')], 'Listen for "then".', 'Brush teeth, eat breakfast, then go to school.', { kind: 'sequence', audio: 'In the morning, I brush my teeth. Then I eat breakfast. Then I go to school.' }),
      listen('On Saturdays, Wei Jie rides his bicycle in the park.', 'Listen. What does Wei Jie do on Saturdays?', P('ride a bicycle', 'act:cycle'), [P('fly a kite', 'act:kite'), P('run', 'act:run'), P('swim', 'act:swim')], 'It has two wheels.', 'Wei Jie rides his bicycle.'),
      blank('Listen. Complete the sentence.', "I go to bed at ___ o'clock.", ['nine', 'five', 'ten'], ['nine'], 'Listen for the number.', "The sentence is \"I go to bed at nine o'clock.\"", { audio: "I go to bed at nine o'clock." }),
      listen('My sister helps my mother cook dinner.', 'Listen. Who helps Mother cook dinner?', 'my sister', ['my brother', 'my father', 'my grandmother'], 'Listen for the person.', 'My sister helps my mother.'),
      listen('Danial goes to school by bus.', 'Listen. How does Danial go to school?', P('by bus', 'bus'), [P('by car', 'car'), P('by bicycle', 'bicycle'), P('by boat', 'boat')], 'Listen for "by ...".', 'Danial goes to school by bus.'),
      listen('What do you do in the evening?', LISTEN_REPLY, 'I do my homework.', ['It is a pencil.', 'Yes, it is.', 'I am fine, thank you.'], 'The question asks what you do.', 'We answer "What do you do...?" with an action, like "I do my homework."'),
    ],
  ),
  buildMission(
    { id: 'ld-y2-m3', categoryId: C, yearLevel: 2, order: 3, title: 'Animal Facts', blurb: 'Listen to the zookeeper.', skill, objective: 'Identify key facts in short spoken information texts.' },
    [
      listen('The elephant drinks water with its trunk.', 'Listen. What does the elephant use to drink?', 'its trunk', ['its tail', 'its ears', 'its feet'], 'It is a very long nose.', 'The elephant drinks with its trunk.'),
      listen('Frogs can jump very far.', 'Listen. Which animal can jump very far?', P('frog'), [P('cat'), P('cow'), P('fish')], 'Listen for the animal name.', 'Frogs can jump very far.'),
      listen('Monkeys like to eat bananas.', 'Listen. What do monkeys like to eat?', P('bananas', 'banana'), [P('apples', 'apple'), P('fish'), P('bread')], 'It is a long yellow fruit.', 'Monkeys like bananas.'),
      order('Listen. Put the life of a butterfly in order.', ['An egg', 'A caterpillar', 'A butterfly'], 'What comes first?', 'An egg, then a caterpillar, then a butterfly.', { kind: 'sequence', audio: 'First, there is an egg. Then, a caterpillar comes out. Finally, it becomes a butterfly.', glossary: [gloss('caterpillar', null, 'a small, long creature that later becomes a butterfly', 'The caterpillar eats leaves.')] }),
      blank('Listen. Complete the sentence.', 'A tiger has orange fur and ___ stripes.', ['black', 'blue', 'green'], ['black'], 'Listen for the colour of the stripes.', 'A tiger has orange fur and black stripes.', { audio: 'A tiger has orange fur and black stripes.' }),
      listen('The turtle walks slowly to the sea.', 'Listen. How does the turtle walk?', 'slowly', ['quickly', 'loudly', 'happily'], 'Listen for a word ending in "-ly".', 'The turtle walks slowly.'),
      listen('Cows give us milk.', 'Listen. What do cows give us?', P('milk'), [P('eggs', 'egg'), P('bread'), P('water')], 'We drink it with breakfast.', 'Cows give us milk.'),
      listen('Ducks can swim, but cats do not like water.', 'Listen. Which animal does not like water?', P('cat'), [P('duck'), P('fish'), P('frog')], 'Listen after the word "but".', 'Cats do not like water.'),
    ],
  ),
  buildMission(
    { id: 'ld-y3-m1', categoryId: C, yearLevel: 3, order: 1, title: 'School Announcements', blurb: 'Listen to messages from the school office.', skill, objective: 'Understand specific information and reasons in spoken announcements.' },
    [
      listen('Good morning, pupils. Sports practice is cancelled today because of the rain.', 'Listen. Why is sports practice cancelled?', 'because it is raining', ['because it is too hot', 'because the teacher is sick', 'because it is Sunday'], 'Listen after the word "because".', 'Practice is cancelled because of the rain.', { glossary: [gloss('cancelled', null, 'will not happen any more', 'The trip is cancelled because of the storm.')] }),
      listen('Year 3 pupils, please bring your colour pencils on Thursday for the art lesson.', 'Listen. What must Year 3 pupils bring?', 'colour pencils', ['a ruler', 'a storybook', 'a water bottle'], 'It is for an art lesson.', 'They must bring colour pencils.'),
      listen('Year 3 pupils, please bring your colour pencils on Thursday for the art lesson.', 'Listen. When is the art lesson?', 'Thursday', ['Tuesday', 'Wednesday', 'Friday'], 'Listen for a day of the week.', 'The art lesson is on Thursday.'),
      order('Listen. Put the fire drill steps in order.', ['Stop what you are doing', 'Line up at the door', 'Walk quietly to the field'], 'Listen for "first", "next" and "then".', 'Stop, line up, then walk quietly to the field.', { kind: 'sequence', audio: 'For the fire drill, first stop what you are doing. Next, line up at the door. Then, walk quietly to the field.', glossary: [gloss('fire drill', null, 'practice for leaving a building safely if there is a fire', 'We had a fire drill today.')] }),
      blank('Listen. Complete the sentence.', 'The library will close at ___ this afternoon.', ['two thirty', 'three thirty', 'twelve thirty'], ['two thirty'], 'Listen for the time.', 'The library will close at two thirty.', { audio: 'The library will close at two thirty this afternoon.' }),
      listen('Pupils who want to join the Science Club, please meet Mr Kumar in the lab after recess.', 'Listen. Who should the pupils meet?', 'Mr Kumar', ['Mrs Tan', 'the head teacher', 'the librarian'], 'Listen for a name.', 'They should meet Mr Kumar.'),
      listen('Pupils who want to join the Science Club, please meet Mr Kumar in the lab after recess.', 'Listen. Where should they meet?', 'in the lab', ['in the hall', 'in the canteen', 'in the library'], 'Listen for a place.', 'They should meet in the lab.'),
      listen('Excuse me, can you tell me where the school office is?', LISTEN_REPLY, 'Yes, it is next to the hall.', ['Yes, I can swim.', 'No, it is my pencil.', 'It is half past two.'], 'The question asks "where".', 'A "where" question needs a place in the answer.'),
    ],
  ),
  buildMission(
    { id: 'ld-y3-m2', categoryId: C, yearLevel: 3, order: 2, title: 'Weekend Plans', blurb: 'Listen to friends talk about their weekends.', skill, objective: 'Understand details, reasons and sequence in short spoken texts.' },
    [
      listen('This Saturday, my family is going to Penang. We will visit my uncle and eat char kuey teow.', 'Listen. Where is the family going?', 'Penang', ['Melaka', 'Ipoh', 'Kuching'], 'Listen for a place name.', 'The family is going to Penang.'),
      listen('This Saturday, my family is going to Penang. We will visit my uncle and eat char kuey teow.', 'Listen. Who will they visit?', 'my uncle', ['my aunt', 'my grandfather', 'my cousin'], 'Listen for a family word.', 'They will visit an uncle.'),
      listen('Kavitha wanted to go to the beach, but it rained, so she stayed home and baked a cake.', 'Listen. What did Kavitha do?', P('baked a cake', 'cake'), [P('went to the beach', 'beach'), P('played ball', 'ball'), P('flew a kite', 'kite')], 'She wanted to do one thing, but did another.', 'She stayed home and baked a cake.'),
      listen('Kavitha wanted to go to the beach, but it rained, so she stayed home and baked a cake.', 'Listen. Why did Kavitha stay home?', 'because it rained', ['because she was sick', 'because the beach was closed', 'because she was tired'], 'Listen for "but" and "so".', 'It rained, so she stayed home.'),
      order('Listen. Put what Hafiz did in order.', [P('Cleaned his room', 'act:sweep'), P('Played football', 'act:football'), P('Read a comic', 'act:read')], 'Morning, afternoon, then evening.', 'Morning: cleaned his room. Afternoon: football. Evening: read a comic.', { kind: 'sequence', audio: 'On Sunday morning, Hafiz cleaned his room. In the afternoon, he played football. In the evening, he read a comic.' }),
      blank('Listen. Complete the sentence.', 'We are taking the train because it is ___ than the bus.', ['faster', 'slower', 'bigger'], ['faster'], 'Why would you choose the train?', 'The train is faster than the bus.', { audio: 'We are taking the train because it is faster than the bus.' }),
      listen("I'm going to the cinema with my cousin. The film starts at quarter past four.", 'Listen. When does the film start?', '4.15', ['3.45', '4.45', '5.15'], '"Quarter past four" is fifteen minutes after four.', 'Quarter past four is 4.15.'),
      listen('Would you like to come to my birthday party on Saturday?', LISTEN_REPLY, 'Yes, I would love to. Thank you!', ['Yes, it is my pencil.', 'No, it is Saturday.', 'I am in Year 3.'], 'This is an invitation.', 'A polite answer to an invitation is "Yes, I would love to. Thank you!"'),
    ],
  ),
  buildMission(
    { id: 'ld-y3-m3', categoryId: C, yearLevel: 3, order: 3, title: 'Following Directions', blurb: 'Listen and find your way around town.', skill, objective: 'Follow spoken directions and multi-step instructions.' },
    [
      listen('Go straight, then turn left at the bakery. The library is on your right.', 'Listen. Where do you turn left?', 'at the bakery', ['at the library', 'at the school', 'at the bank'], 'Listen for "turn left at".', 'You turn left at the bakery.'),
      listen('Go straight, then turn left at the bakery. The library is on your right.', 'Listen. Where is the library?', 'on your right', ['on your left', 'behind you', 'straight ahead'], 'Listen to the last part.', 'The library is on your right.'),
      listen('Put the red book on the top shelf and the blue book on the bottom shelf.', 'Listen. Where does the blue book go?', 'on the bottom shelf', ['on the top shelf', 'in the bag', 'under the table'], 'Listen for the word "blue".', 'The blue book goes on the bottom shelf.'),
      order('Listen. Put the steps for a paper boat in order.', ['Fold the paper in half', 'Fold the corners down', 'Open the bottom and press it flat'], 'Listen for "first", "next" and "then".', 'Fold in half, fold the corners, then open and press flat.', { kind: 'sequence', audio: 'To make a paper boat, first fold the paper in half. Next, fold the corners down. Then, open the bottom and press it flat.' }),
      listen('The cat is hiding behind the bed.', LISTEN_PIC, P('cat behind the bed', scene('cat', 'behind', 'bed')), [P('cat on the bed', scene('cat', 'on', 'bed')), P('cat under the bed', scene('cat', 'under', 'bed')), P('cat in front of the bed', scene('cat', 'in front of', 'bed'))], '"Behind" means at the back.', 'The cat is behind the bed.'),
      blank('Listen. Complete the sentence.', 'Cross the road at the ___.', ['traffic lights', 'post office', 'bus stop'], ['traffic lights'], 'Where is it safe to cross?', 'You cross the road at the traffic lights.', { audio: 'Walk past the post office and cross the road at the traffic lights.' }),
      listen('Take two steps forward, then turn around and wave.', 'Listen. What do you do last?', P('wave', 'act:wave'), [P('jump', 'act:jump'), P('sit down', 'act:sit'), P('run', 'act:run')], 'Listen to the end of the instruction.', 'The last action is to wave.'),
      listen('The market is between the bank and the school.', 'Listen. Where is the market?', 'between the bank and the school', ['behind the bank', 'next to the park', 'opposite the school'], '"Between" means in the middle of two things.', 'The market is between the bank and the school.'),
    ],
  ),
];
