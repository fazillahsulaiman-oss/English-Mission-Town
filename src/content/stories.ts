import { gloss } from './authoring';
import type { Story } from '../engine/types';

// Original stories. Suggested editorial lengths (product starting points, not KPM requirements):
// Year 1 ≈ 20–40 words, Year 2 ≈ 40–70 words, Year 3 ≈ 60–100 words.
export const STORIES: Story[] = [
  {
    id: 'y1-oyen',
    yearLevel: 1,
    title: "Aina's Cat",
    text: 'Aina has a cat. The cat is orange. Its name is Oyen. Oyen likes fish. Oyen sleeps under the table. Aina loves Oyen.',
    illustration: ['cat', 'fish', 'table'],
    glossaryEntries: [],
  },
  {
    id: 'y1-park',
    yearLevel: 1,
    title: 'At the Park',
    text: 'Ravi goes to the park. He sees a big tree. He sees a red kite in the sky. Ravi runs and laughs. He is happy.',
    illustration: ['park', 'kite:red', 'act:run'],
    glossaryEntries: [gloss('laughs', null, 'makes a happy sound when something is funny', 'Ravi laughs at the funny clown.')],
  },
  {
    id: 'y1-bag',
    yearLevel: 1,
    title: "Mei Ling's Bag",
    text: 'Mei Ling has a blue bag. In her bag, there is a book, a pencil and an apple. She eats the apple at recess.',
    illustration: ['bag:blue', 'book', 'apple'],
    glossaryEntries: [gloss('recess', 'break time', 'the short break at school when you eat and play', 'We play tag at recess.')],
  },
  {
    id: 'y1-rain',
    yearLevel: 1,
    title: 'Rainy Day',
    text: 'It is raining. Danial takes his yellow umbrella. He walks to school with his mother. His shoes are wet. He smiles.',
    illustration: ['rain', 'umbrella:yellow', 'school'],
    glossaryEntries: [gloss('wet', null, 'covered with water', 'My hair is wet after swimming.')],
  },
  {
    id: 'y1-duck',
    yearLevel: 1,
    title: 'The Little Duck',
    text: "A little duck lives near the pond. It can swim, but it cannot fly far. Every morning, Siti gives the duck some bread. The duck says, 'Quack!'",
    illustration: ['duck', 'bread', 'sun'],
    glossaryEntries: [gloss('pond', 'small lake', 'a small area of still water', 'Frogs live in the pond.')],
  },
  {
    id: 'y1-birthday',
    yearLevel: 1,
    title: 'Birthday Cake',
    text: "Today is Hafiz's birthday. He is seven. Mum makes a big cake. His friends sing a song. Hafiz blows out the candles. Everyone claps.",
    illustration: ['cake', 'act:sing', 'star'],
    glossaryEntries: [gloss('candles', null, 'small sticks of wax with a flame on top', 'There are seven candles on the cake.')],
  },
  {
    id: 'y2-market',
    yearLevel: 2,
    title: 'The Night Market',
    text: 'On Friday evening, Kavitha goes to the night market with her father. The market is busy and bright. They buy satay, corn and a bag of oranges. Kavitha sees a man selling colourful balloons. She chooses a pink one. On the way home, the balloon floats above her head. Kavitha thanks her father for a lovely evening.',
    illustration: ['shop', 'orange*3', 'moon'],
    glossaryEntries: [
      gloss('busy', 'full of people', 'a place with many people doing things', 'The canteen is busy at recess.'),
      gloss('floats', null, 'stays up in the air or on water without falling', 'The leaf floats on the river.'),
    ],
  },
  {
    id: 'y2-pencilcase',
    yearLevel: 2,
    title: 'The Lost Pencil Case',
    text: "Wei Jie cannot find his pencil case. He looks in his bag, but it is not there. He looks under his desk, but it is not there. His friend Nurul helps him. They walk to the library. The pencil case is on a table near the window! Wei Jie forgot it after reading time. He says, 'Thank you, Nurul!'",
    illustration: ['bag', 'library', 'table'],
    glossaryEntries: [gloss('forgot', null, 'did not remember', 'I forgot my water bottle at home.')],
  },
  {
    id: 'y2-garden',
    yearLevel: 2,
    title: "Grandmother's Garden",
    text: 'Every Saturday, Arjun visits his grandmother in the village. She has a small garden behind her house. There are chillies, bananas and pretty flowers. Arjun waters the plants with a green watering can. Grandmother picks some bananas for him. Later, they sit on the steps and eat banana fritters together. Arjun thinks Saturday is the best day of the week.',
    illustration: ['house', 'banana', 'flower'],
    glossaryEntries: [
      gloss('village', null, 'a small place in the countryside with a few houses', 'My grandfather lives in a village near the river.'),
      gloss('fritters', null, 'pieces of fruit or vegetable fried in batter', 'Banana fritters are sweet and crispy.'),
    ],
  },
  {
    id: 'y3-hornbill',
    yearLevel: 3,
    title: 'The Hornbill Visitor',
    text: "One morning, the pupils of Year 3 Bestari heard a loud call outside their classroom. A large bird with a big yellow and red beak was sitting on the mango tree. 'It's a hornbill!' said Teacher Lim. She explained that hornbills live in the rainforest and eat fruit. The pupils watched quietly so they would not frighten it. After ten minutes, the hornbill spread its wings and flew away. That afternoon, everyone drew a picture of the bird. Priya wrote, 'Today was a special day.'",
    illustration: ['hornbill', 'tree', 'school'],
    glossaryEntries: [
      gloss('beak', null, 'the hard, pointed mouth of a bird', 'The bird picks up seeds with its beak.'),
      gloss('frighten', 'scare', 'make someone or something feel afraid', 'Loud noises can frighten small animals.'),
      gloss('rainforest', null, 'a thick forest with tall trees and lots of rain', 'Orang-utans live in the rainforest.'),
    ],
  },
  {
    id: 'y3-sportsday',
    yearLevel: 3,
    title: 'Sports Day Surprise',
    text: "It was Sports Day at Taman Ria Primary School. Daniel was in the relay race with three friends. He was nervous because he was the last runner. When the baton came to him, his team was in third place. Daniel ran as fast as he could. He passed one runner, then another! The crowd cheered loudly. Daniel's team finished first. His friends hugged him, and his teacher gave each of them a gold medal. Daniel learned that practice and teamwork can make a big difference.",
    illustration: ['act:run', 'star:yellow', 'face:happy'],
    glossaryEntries: [
      gloss('nervous', 'worried', 'a little afraid about something that will happen', 'I feel nervous before a test.'),
      gloss('baton', null, 'a short stick that runners pass to each other in a relay race', 'Hold the baton tightly and run!'),
      gloss('teamwork', null, 'working well together in a group', 'With teamwork, we cleaned the class quickly.'),
    ],
  },
  {
    id: 'y3-recycling',
    yearLevel: 3,
    title: 'The Recycling Project',
    text: 'Siti\'s class wanted to keep their school clean. They started a recycling project. Every Monday, pupils brought old newspapers, plastic bottles and tin cans from home. They put the items into three big boxes: blue for paper, orange for plastic and grey for cans. At the end of the month, the class sold everything to a recycling centre. They used the money to buy new storybooks for the class library. Siti felt proud because a small idea had helped the whole school.',
    illustration: ['box:blue', 'box:orange', 'box:grey'],
    glossaryEntries: [
      gloss('recycling', null, 'using old things again to make new things', 'Recycling paper saves trees.'),
      gloss('proud', null, 'happy because you or someone did something good', 'Mum is proud of my drawing.'),
    ],
  },
];

export const STORY_BY_ID: Record<string, Story> = Object.fromEntries(STORIES.map((s) => [s.id, s]));

export function wordCount(text: string): number {
  return text.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

export const STORY_LENGTH_GUIDE: Record<1 | 2 | 3, [number, number]> = { 1: [20, 40], 2: [40, 70], 3: [60, 100] };
