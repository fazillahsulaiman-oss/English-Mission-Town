import { buildMission, gloss, mc, match, P, pc, sort, blank } from '../authoring';
import type { Mission } from '../../engine/types';

const C = 'word-explorer' as const;
const skill = 'Reading' as const;

export const WORD_EXPLORER: Mission[] = [
  buildMission(
    { id: 'we-y1-m1', categoryId: C, yearLevel: 1, order: 1, title: 'Animals in the Park', blurb: 'Meet the animals around Town Park.', skill, objective: 'Recognise and name familiar animals from simple descriptions.' },
    [
      pc('Which animal has a long trunk?', P('elephant'), [P('giraffe'), P('tiger'), P('monkey')], 'A trunk is a very long nose.', 'An elephant has a long trunk. It uses its trunk to drink and pick up food.', { glossary: [gloss('trunk', null, "an elephant's long nose", 'The elephant sprays water with its trunk.', true)] }),
      pc('Which animal can fly?', P('bird'), [P('cat'), P('frog'), P('cow')], 'Look for an animal with wings.', 'A bird has wings, so it can fly.'),
      pc('Which animal lives in water and has fins?', P('fish'), [P('rabbit'), P('dog'), P('chicken')], 'Fins help an animal swim.', 'A fish lives in water. It uses its fins to swim.', { glossary: [gloss('fins', null, 'thin, flat parts on a fish that help it swim', 'The fish moves its fins.', true)] }),
      pc('Which animal says "moo"?', P('cow'), [P('duck'), P('cat'), P('dog')], 'This animal gives us milk.', 'A cow says "moo". A duck says "quack" and a dog says "woof".'),
      pc('Which animal has stripes?', P('tiger'), [P('elephant'), P('frog'), P('rabbit')], 'Stripes are long lines on the body.', 'A tiger has orange fur with black stripes.', { glossary: [gloss('stripes', 'lines', 'long, thin lines of colour', 'My shirt has blue stripes.', true)] }),
      sort('Can it fly or can it swim? Put each animal in a group.', ['It can fly', 'It can swim'], [['bird', 'It can fly', 'bird'], ['butterfly', 'It can fly', 'butterfly'], ['fish', 'It can swim', 'fish'], ['turtle', 'It can swim', 'turtle']], 'Think: does it have wings or fins?', 'Birds and butterflies have wings, so they fly. Fish and turtles swim in water.'),
      match('Match each word to its picture.', [['cat', P('cat')], ['dog', P('dog')], ['rabbit', P('rabbit')], ['monkey', P('monkey')]], 'Read each word slowly. Look at the ears and tails.', 'A rabbit has long ears. A monkey has a long tail and likes to climb.'),
      pc('Which animal is slow and has a hard shell?', P('turtle'), [P('rabbit'), P('tiger'), P('monkey')], 'This animal carries its house on its back.', 'A turtle is slow. It has a hard shell to keep it safe.', { glossary: [gloss('shell', null, 'a hard cover on the back of some animals', 'The snail hides in its shell.')] }),
    ],
  ),
  buildMission(
    { id: 'we-y1-m2', categoryId: C, yearLevel: 1, order: 2, title: 'My School Things', blurb: 'Find the things in your school bag.', skill, objective: 'Recognise and name common classroom objects.' },
    [
      pc('You write with it. What is it?', P('pencil'), [P('ruler'), P('bag'), P('chair')], 'It has a sharp point.', 'We write with a pencil.'),
      pc('You carry your books in it.', P('bag'), [P('table'), P('eraser'), P('clock')], 'You wear it on your back.', 'A school bag carries your books.'),
      pc('You sit on it in class.', P('chair'), [P('book'), P('ball'), P('pencil')], 'It has four legs and a back.', 'We sit on a chair.'),
      pc('It tells us the time.', P('clock'), [P('ruler'), P('hat'), P('box')], 'Look for numbers and hands.', 'A clock tells us the time.'),
      match('Match each word to its picture.', [['book', P('book')], ['ruler', P('ruler')], ['eraser', P('eraser')], ['table', P('table')]], 'A ruler is long and straight.', 'You read a book, draw lines with a ruler, rub out with an eraser and write on a table.'),
      sort('Is it a school thing or a kitchen thing?', ['School things', 'Kitchen things'], [['pencil', 'School things', 'pencil'], ['ruler', 'School things', 'ruler'], ['spoon', 'Kitchen things', 'spoon'], ['plate', 'Kitchen things', 'plate']], 'Which ones do you use to eat?', 'We use pencils and rulers at school. We use spoons and plates to eat.'),
      pc('Which one rubs out a mistake?', P('eraser'), [P('pencil'), P('book'), P('bag')], 'It is small and soft.', 'An eraser rubs out pencil marks.', { glossary: [gloss('rubs out', 'removes', 'takes away pencil marks', 'I rub out the wrong word.')] }),
      mc('Aina wants to draw a straight line. What does she need?', 'a ruler', ['a spoon', 'a ball', 'a hat'], 'It is long, flat and has numbers on it.', 'A ruler helps us draw straight lines.'),
    ],
  ),
  buildMission(
    { id: 'we-y1-m3', categoryId: C, yearLevel: 1, order: 3, title: 'Colours and Fruit', blurb: 'Pick colourful fruit at the park picnic.', skill, objective: 'Recognise colour words and simple describing words.' },
    [
      pc('Which fruit is yellow and long?', P('banana'), [P('apple', 'apple:red'), P('orange'), P('watermelon')], 'Monkeys love this fruit.', 'A banana is yellow and long.'),
      pc('Which ball is blue?', P('blue ball', 'ball:blue'), [P('red ball', 'ball:red'), P('yellow ball', 'ball:yellow'), P('green ball', 'ball:green')], 'Blue is the colour of the sky.', 'This ball is blue, like the sky.'),
      match('Match each colour word to its colour.', [['red', P('red', 'swatch:red')], ['blue', P('blue', 'swatch:blue')], ['yellow', P('yellow', 'swatch:yellow')], ['green', P('green', 'swatch:green')]], 'Grass is green. The sun is yellow.', 'Red, blue, yellow and green are colour words.'),
      pc('Which fruit is green outside and red inside?', P('watermelon'), [P('apple'), P('banana'), P('orange')], 'It is big and juicy, with black seeds.', 'A watermelon is green outside and red inside.'),
      sort('Is it a fruit?', ['Fruit', 'Not fruit'], [['apple', 'Fruit', 'apple'], ['banana', 'Fruit', 'banana'], ['bag', 'Not fruit', 'bag'], ['shoe', 'Not fruit', 'shoe']], 'Can you eat it?', 'Apples and bananas are fruit. A bag and a shoe are not food.'),
      pc('Mei Ling has a purple umbrella. Which one is hers?', P('purple umbrella', 'umbrella:purple'), [P('pink umbrella', 'umbrella:pink'), P('blue umbrella', 'umbrella:blue'), P('orange umbrella', 'umbrella:orange')], 'Purple is a mix of red and blue.', 'Her umbrella is purple.'),
      mc('What shape is an orange?', 'round', ['long', 'square', 'flat'], 'It is shaped like a ball.', 'An orange is round, like a ball.', { image: 'orange' }),
      match('Match each word to its meaning.', [['big', 'not small'], ['hot', 'not cold'], ['happy', 'not sad'], ['fast', 'not slow']], 'Think of the opposite word.', 'Big is the opposite of small. Hot is the opposite of cold.'),
    ],
  ),
  buildMission(
    { id: 'we-y2-m1', categoryId: C, yearLevel: 2, order: 1, title: 'Action Words', blurb: 'Spot the actions in the park.', skill, objective: 'Recognise action words (verbs) for everyday activities.' },
    [
      pc('Which picture shows "read"?', P('read', 'act:read'), [P('sing', 'act:sing'), P('swim', 'act:swim'), P('cook', 'act:cook')], 'Look for a book.', 'When we read, we look at the words in a book.'),
      pc('Arjun is in the pool. What is he doing?', P('swim', 'act:swim'), [P('run', 'act:run'), P('sleep', 'act:sleep'), P('draw', 'act:draw')], 'A pool is full of water.', 'Arjun is swimming in the pool.'),
      pc('Which picture shows someone brushing their teeth?', P('brush teeth', 'act:brush'), [P('wash hands', 'act:wash'), P('eat', 'act:eat'), P('write', 'act:write')], 'Look for a toothbrush.', 'We brush our teeth with a toothbrush.'),
      match('Match each action to its picture.', [['cook', P('cook', 'act:cook')], ['sweep', P('sweep', 'act:sweep')], ['plant', P('plant', 'act:plant')], ['draw', P('draw', 'act:draw')]], 'A broom is for sweeping. A pot is for planting.', 'We cook in a pan, sweep with a broom, plant in a pot and draw on paper.', { glossary: [gloss('sweep', null, 'clean the floor with a broom', 'I sweep the classroom floor.', true)] }),
      sort('Do we do it with our hands or our legs?', ['With our hands', 'With our legs'], [['write', 'With our hands', 'act:write'], ['clap', 'With our hands'], ['run', 'With our legs', 'act:run'], ['jump', 'With our legs', 'act:jump']], 'Try each action. What moves?', 'We write and clap with our hands. We run and jump with our legs.'),
      mc('You do this at night when you are tired.', 'sleep', ['swim', 'sing', 'cook'], 'You do it in bed.', 'When we are tired, we sleep.'),
      pc('Which picture shows "fly a kite"?', P('fly a kite', 'act:kite'), [P('ride a bicycle', 'act:cycle'), P('play football', 'act:football'), P('climb', 'act:climb')], 'Look up at the sky.', 'You fly a kite on a windy day.'),
      mc('Which word means "move very fast on your legs"?', 'run', ['sit', 'sleep', 'read'], 'You do this in a race.', 'To run is to move very fast on your legs.'),
    ],
  ),
  buildMission(
    { id: 'we-y2-m2', categoryId: C, yearLevel: 2, order: 2, title: 'Weather and Clothes', blurb: 'Get ready for sun, rain and wind.', skill, objective: 'Use weather and clothing vocabulary in context.' },
    [
      pc('It is a hot and sunny day. Which picture shows the weather?', P('sunny', 'sun'), [P('rainy', 'rain'), P('windy', 'windy'), P('cloudy', 'cloud')], 'Look for something bright and yellow.', 'On a sunny day, the sun is shining.'),
      pc('What do you need when it rains?', P('umbrella'), [P('kite'), P('ball'), P('ice cream', 'icecream')], 'It keeps you dry.', 'An umbrella keeps you dry in the rain.'),
      match('Match each weather word to its picture.', [['sunny', P('sunny', 'sun')], ['rainy', P('rainy', 'rain')], ['windy', P('windy', 'windy')], ['cloudy', P('cloudy', 'cloud')]], 'Windy weather moves leaves.', 'Sunny has sun, rainy has rain, windy has moving air and cloudy has clouds.'),
      sort('Is it something to wear or something to eat?', ['Things to wear', 'Things to eat'], [['shirt', 'Things to wear', 'shirt'], ['shoe', 'Things to wear', 'shoe'], ['hat', 'Things to wear', 'hat'], ['bread', 'Things to eat', 'bread'], ['egg', 'Things to eat', 'egg'], ['banana', 'Things to eat', 'banana']], 'Can you put it on your body?', 'We wear shirts, shoes and hats. We eat bread, eggs and bananas.'),
      blank('Choose the word that fits.', 'On a windy day, it is fun to fly a ___.', ['kite', 'bed', 'cake'], ['kite'], 'It flies high in the sky.', 'We fly a kite when it is windy.'),
      pc('Which one do you wear on your feet?', P('shoe'), [P('hat'), P('shirt'), P('bag')], 'You put it on before you go out to play.', 'We wear shoes on our feet.'),
      mc('The sky is grey and water is falling. What is the weather?', 'rainy', ['sunny', 'hot', 'dry'], 'Water is falling from the clouds.', 'When water falls from grey clouds, it is rainy.'),
      pc('Danial needs something to keep the sun off his head.', P('hat'), [P('shoe'), P('spoon'), P('book')], 'You wear it on your head.', 'A hat keeps the sun off your head.'),
    ],
  ),
  buildMission(
    { id: 'we-y2-m3', categoryId: C, yearLevel: 2, order: 3, title: 'People and Places', blurb: 'Who works where in Mission Town?', skill, objective: 'Name community helpers and places in town.' },
    [
      pc('Who helps sick people get better?', P('doctor', 'person:doctor'), [P('farmer', 'person:farmer'), P('chef', 'person:chef'), P('postman', 'person:postman')], 'This person works in a hospital.', 'A doctor helps sick people.'),
      pc('Where can you borrow books?', P('library'), [P('hospital'), P('shop'), P('beach')], 'It is a quiet place full of books.', 'We borrow books from a library.', { glossary: [gloss('borrow', null, 'take something and give it back later', 'Can I borrow your pencil?')] }),
      match('Match each job to its picture.', [['teacher', P('teacher', 'person:teacher')], ['doctor', P('doctor', 'person:doctor')], ['chef', P('chef', 'person:chef')], ['farmer', P('farmer', 'person:farmer')]], 'A chef wears a tall white hat.', 'A teacher teaches, a doctor helps sick people, a chef cooks and a farmer grows food.'),
      sort('Is it a person or a place?', ['Person', 'Place'], [['teacher', 'Person'], ['doctor', 'Person'], ['chef', 'Person'], ['school', 'Place'], ['library', 'Place'], ['beach', 'Place']], 'Can you visit it, or can you talk to it?', 'Teachers, doctors and chefs are people. Schools, libraries and beaches are places.'),
      pc('Where can you swim in the sea and build sandcastles?', P('beach'), [P('library'), P('school'), P('hospital')], 'There is sand and water there.', 'At the beach, we can swim and build sandcastles.'),
      blank('Choose the word that fits.', 'A ___ cooks food in a restaurant.', ['chef', 'doctor', 'farmer'], ['chef'], 'This person works in a kitchen.', 'A chef cooks food.'),
      pc('Who brings letters to your house?', P('postman', 'person:postman'), [P('doctor', 'person:doctor'), P('teacher', 'person:teacher'), P('firefighter', 'person:firefighter')], 'This person carries letters and parcels.', 'A postman brings letters.'),
      pc('Who puts out fires?', P('firefighter', 'person:firefighter'), [P('chef', 'person:chef'), P('farmer', 'person:farmer'), P('teacher', 'person:teacher')], 'This person wears a strong helmet.', 'A firefighter puts out fires and keeps people safe.'),
    ],
  ),
  buildMission(
    { id: 'we-y3-m1', categoryId: C, yearLevel: 3, order: 1, title: 'Describing Words', blurb: 'Use bigger words to describe the park.', skill, objective: 'Understand and use describing words (adjectives), including synonyms and opposites.' },
    [
      match('Match each word to its meaning.', [['enormous', 'very big'], ['tiny', 'very small'], ['delicious', 'tastes very good'], ['noisy', 'makes a lot of sound']], 'Tiny is the opposite of enormous.', 'Enormous means very big. Tiny means very small.'),
      mc('The elephant is ___. It is very, very big.', 'enormous', ['tiny', 'thin', 'quiet'], 'The second sentence tells you the meaning.', 'Enormous means very big, so it describes the elephant well.', { image: 'elephant', glossary: [gloss('enormous', 'very big', 'much bigger than usual', 'The elephant is enormous.', true)] }),
      mc('Which word best describes how a turtle moves?', 'slowly', ['quickly', 'loudly', 'angrily'], 'Turtles do not move fast.', 'A turtle moves slowly.', { image: 'turtle' }),
      sort('Sort the describing words: size or feelings?', ['Size', 'Feelings'], [['huge', 'Size'], ['tiny', 'Size'], ['short', 'Size'], ['cheerful', 'Feelings'], ['worried', 'Feelings'], ['excited', 'Feelings']], 'Does the word tell how big something is, or how someone feels?', 'Huge, tiny and short describe size. Cheerful, worried and excited describe feelings.'),
      pc('Which face looks surprised?', P('surprised', 'face:surprised'), [P('tired', 'face:tired'), P('angry', 'face:angry'), P('sad', 'face:sad')], 'A surprised face has wide eyes and an open mouth.', 'When we are surprised, our mouth opens wide.'),
      mc('My teh tarik is very hot. Which word means the opposite of "hot"?', 'cold', ['warm', 'spicy', 'sweet'], 'Think of ice.', 'Cold is the opposite of hot. Warm is only a little hot.'),
      mc('The library is very ___. Everyone reads without talking.', 'quiet', ['noisy', 'crowded', 'dirty'], 'No one is talking.', 'Quiet means there is very little sound.', { glossary: [gloss('crowded', 'full', 'full of people', 'The bus is crowded in the morning.')] }),
      match('Match each feeling word to a face.', [['happy', P('happy', 'face:happy')], ['sad', P('sad', 'face:sad')], ['tired', P('tired', 'face:tired')], ['scared', P('scared', 'face:scared')]], 'A tired face has sleepy eyes.', 'Happy faces smile. Sad faces frown. Tired faces look sleepy. Scared faces look worried.'),
    ],
  ),
  buildMission(
    { id: 'we-y3-m2', categoryId: C, yearLevel: 3, order: 2, title: 'Food and Healthy Habits', blurb: 'Plan a healthy picnic.', skill, objective: 'Use food and daily-habit vocabulary in meaningful contexts.' },
    [
      sort('Which food should we eat often, and which only sometimes?', ['Eat often', 'Eat only sometimes'], [['apple', 'Eat often', 'apple'], ['banana', 'Eat often', 'banana'], ['orange', 'Eat often', 'orange'], ['cake', 'Eat only sometimes', 'cake'], ['ice cream', 'Eat only sometimes', 'icecream']], 'Which foods have lots of sugar?', 'Fruit is healthy to eat often. Cake and ice cream have lots of sugar, so we eat them only sometimes.'),
      mc('Which meal do we eat in the morning?', 'breakfast', ['lunch', 'dinner', 'supper'], 'It is the first meal of the day.', 'Breakfast is the first meal of the day.'),
      match('Match each meal to its time.', [['breakfast', 'in the morning'], ['lunch', 'in the afternoon'], ['dinner', 'in the evening'], ['a snack', 'between meals']], 'Lunch is in the middle of the day.', 'We eat breakfast in the morning, lunch in the afternoon and dinner in the evening.'),
      pc('Which one can you drink when you are thirsty?', P('water'), [P('bread'), P('cake'), P('egg')], 'You drink it from a glass.', 'When we are thirsty, we drink water.', { glossary: [gloss('thirsty', null, 'wanting something to drink', 'I am thirsty after running.', true)] }),
      blank('Choose the word that fits.', 'We brush our teeth with a ___.', ['toothbrush', 'spoon', 'pencil'], ['toothbrush'], 'It has small, soft bristles.', 'We use a toothbrush to clean our teeth.'),
      pc('Which picture shows someone washing their hands?', P('wash hands', 'act:wash'), [P('brush teeth', 'act:brush'), P('cook', 'act:cook'), P('drink', 'act:drink')], 'Look for water and soap bubbles.', 'We wash our hands with soap and water.'),
      mc('Vegetables like carrots and spinach help us grow ___.', 'strong', ['weak', 'sleepy', 'tiny'], 'Healthy food is good for our bodies.', 'Vegetables help our bodies grow strong.'),
      mc('Which word means "very hungry"?', 'starving', ['thirsty', 'full', 'sleepy'], 'You feel this when you have not eaten for a long time.', 'Starving means very hungry. Full means you cannot eat any more.'),
    ],
  ),
  buildMission(
    { id: 'we-y3-m3', categoryId: C, yearLevel: 3, order: 3, title: 'Nature Explorer', blurb: 'Explore the rainforest corner of the park.', skill, objective: 'Classify living things and describe animals using topic vocabulary.' },
    [
      pc('This bird has a large beak with a helmet-like top. It lives in the rainforest.', P('hornbill'), [P('duck'), P('chicken'), P('bird')], 'Look at the biggest, most colourful beak.', 'A hornbill has a large beak with a casque on top, like a helmet.', { glossary: [gloss('beak', null, 'the hard, pointed mouth of a bird', 'The bird eats seeds with its beak.'), gloss('rainforest', null, 'a thick forest with tall trees and lots of rain', 'Many animals live in the rainforest.')] }),
      mc('Which animal is a reptile with no legs?', 'snake', ['frog', 'monkey', 'fish'], 'It moves by sliding on the ground.', 'A snake is a reptile. It has no legs.', { glossary: [gloss('reptile', null, 'an animal with dry, scaly skin, like a snake or a turtle', 'A crocodile is a reptile.')] }),
      sort('Living or non-living?', ['Living things', 'Non-living things'], [['tree', 'Living things', 'tree'], ['flower', 'Living things', 'flower'], ['butterfly', 'Living things', 'butterfly'], ['ball', 'Non-living things', 'ball'], ['car', 'Non-living things', 'car'], ['clock', 'Non-living things', 'clock']], 'Living things grow and need food or water.', 'Trees, flowers and butterflies grow, so they are living. Balls, cars and clocks do not grow.'),
      match('Where does each animal live?', [[P('bird'), 'a nest'], [P('fish'), 'a river'], [P('monkey'), 'the trees'], [P('rabbit'), 'a burrow']], 'A burrow is a hole under the ground.', 'Birds live in nests, fish in rivers, monkeys in trees and rabbits in burrows.', { glossary: [gloss('burrow', null, 'a hole in the ground where some animals live', 'The rabbit hides in its burrow.')] }),
      mc('Durian, rambutan and mangosteen are kinds of ___.', 'fruit', ['vegetables', 'flowers', 'animals'], 'They are sweet and grow on trees.', 'Durian, rambutan and mangosteen are tropical fruit.'),
      pc('Which creature starts life as a caterpillar?', P('butterfly'), [P('frog'), P('bird'), P('turtle')], 'It has colourful wings.', 'A caterpillar changes into a butterfly.', { glossary: [gloss('caterpillar', null, 'a small, long creature like a worm that later becomes a butterfly', 'The caterpillar eats leaves.')] }),
      mc("Which words best describe a frog's skin?", 'wet and smooth', ['hard and dry', 'soft and furry', 'covered in feathers'], 'Frogs live near water.', "A frog's skin is wet and smooth."),
      mc('Which group has only animals?', 'tiger, monkey, hornbill', ['tiger, tree, river', 'flower, monkey, rock', 'rain, hornbill, leaf'], 'Check every word in the group.', 'Tigers, monkeys and hornbills are all animals. Trees, rivers, rocks and leaves are not.'),
    ],
  ),
];
