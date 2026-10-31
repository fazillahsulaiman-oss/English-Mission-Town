import { buildMission, dlg, gloss, match, mc, order, P } from '../authoring';
import type { Mission } from '../../engine/types';

const C = 'everyday-english' as const;
const skill = 'Speaking' as const;
const REPLY = 'Choose the best reply.';
const ORDER = 'Put the conversation in order.';

export const EVERYDAY_ENGLISH: Mission[] = [
  buildMission(
    { id: 'ee-y1-m1', categoryId: C, yearLevel: 1, order: 1, title: 'Hello and Goodbye', blurb: 'Greet friends at the café.', skill, objective: 'Choose suitable greetings, introductions and farewells in short exchanges.' },
    [
      dlg(REPLY, [['Teacher', 'Good morning, class!'], ['You', null]], 'Good morning, teacher!', ['Good night!', 'Thank you!', 'I am a pencil.'], 'It is the morning.', 'We reply to "Good morning" with "Good morning".'),
      dlg(REPLY, [['Mei Ling', 'Hi! How are you?'], ['You', null]], "I'm fine, thank you.", ["I'm seven.", 'Goodbye!', 'Yes, it is.'], 'She asks how you feel.', 'We answer "How are you?" with "I\'m fine, thank you."'),
      dlg(REPLY, [['Ravi', 'What is your name?'], ['You', null]], 'My name is Aina.', ['I am fine.', 'It is blue.', 'Good night.'], 'Ravi asks for your name.', 'We answer with "My name is ...".'),
      match('Match each question to its answer.', [['How are you?', "I'm fine, thank you."], ['What is your name?', 'My name is Danial.'], ['How old are you?', 'I am seven.'], ['Goodbye!', 'See you tomorrow!']], '"How old" is about age.', 'Each question has a matching answer.'),
      dlg(REPLY, [['Mum', "It's time for bed. Good night!"], ['You', null]], 'Good night, Mum!', ['Good morning, Mum!', 'Hello, Mum!', 'Happy birthday, Mum!'], 'It is bedtime.', 'At bedtime, we say "Good night".'),
      order(ORDER, ['Siti: Hello, Wei Jie!', 'Wei Jie: Hello, Siti! How are you?', "Siti: I'm fine, thank you."], 'Who says hello first?', 'First a greeting, then a question, then an answer.', { kind: 'sequence' }),
      dlg(REPLY, [['Teacher', 'Nice to meet you.'], ['You', null]], 'Nice to meet you too.', ['Yes, please.', 'I am sorry.', 'Here you are.'], 'Say the same nice words back.', 'We answer "Nice to meet you" with "Nice to meet you too."'),
      dlg(REPLY, [['Friend', 'See you tomorrow!'], ['You', null]], 'Bye! See you!', ['Good morning!', 'Thank you, I am six.', 'Can I help you?'], 'Your friend is leaving.', 'When someone leaves, we say "Bye!"'),
    ],
  ),
  buildMission(
    { id: 'ee-y1-m2', categoryId: C, yearLevel: 1, order: 2, title: 'Please and Thank You', blurb: 'Use magic words at the market.', skill, objective: 'Use polite words: please, thank you, sorry and you\'re welcome.' },
    [
      dlg(REPLY, [['Shopkeeper', 'Can I help you?'], ['You', null]], 'Yes, I would like a pencil, please.', ['Yes, you are a pencil.', 'No, it is Monday.', 'Goodbye, pencil.'], 'Say what you want and add "please".', '"I would like ..., please" is a polite way to ask.', { image: 'shop' }),
      dlg(REPLY, [['Friend', 'Here is your pencil.'], ['You', null]], 'Thank you!', ['Sorry!', 'Good night!', "You're welcome!"], 'Your friend gives you something.', 'When someone gives you something, say "Thank you!"'),
      dlg('What do you say first?', [['You', null], ['Teacher', 'Yes, you may.']], 'May I go to the toilet, please?', ['I go toilet.', 'Toilet, now!', 'Yes, you may.'], 'Ask politely with "May I ...?"', '"May I ..., please?" is a polite question.'),
      dlg(REPLY, [['Aina', 'Thank you for the cake!'], ['You', null]], "You're welcome!", ['Thank you!', 'Hello!', 'Me too!'], 'What do we say after "Thank you"?', 'We answer "Thank you" with "You\'re welcome!"'),
      match('What do you say? Match each one.', [['You bump into a friend.', 'Sorry!'], ['Someone gives you a present.', 'Thank you!'], ['You want some water.', 'Water, please.'], ['Someone says thank you.', "You're welcome!"]], 'Bumping into someone is an accident.', 'Sorry, thank you, please and you\'re welcome are polite words.'),
      dlg(REPLY, [['Mum', 'Would you like some juice?'], ['You', null]], 'Yes, please.', ['Yes, you would.', 'I am juice.', 'Goodbye, please.'], 'Say yes politely.', 'We answer "Would you like ...?" with "Yes, please" or "No, thank you".'),
      mc('You want to use your friend\'s eraser. What do you say?', 'Can I use your eraser, please?', ['Give me eraser!', 'This is my eraser.', 'Thank you, eraser.'], 'Ask a question and use "please".', 'Asking with "Can I ..., please?" is polite.', { image: 'eraser' }),
      order(ORDER, ['Ravi: Can I have a balloon, please?', 'Seller: Yes. Here you are.', 'Ravi: Thank you!'], 'Ravi asks first.', 'Ask, receive, then say thank you.', { kind: 'sequence' }),
    ],
  ),
  buildMission(
    { id: 'ee-y1-m3', categoryId: C, yearLevel: 1, order: 3, title: 'In the Classroom', blurb: 'Talk with your teacher and friends.', skill, objective: 'Understand and respond to simple classroom language.' },
    [
      dlg(REPLY, [['Teacher', 'Please open your books.'], ['You', null]], 'Yes, teacher.', ['No, thank you, teacher.', 'Good night, teacher.', 'I am a book.'], 'The teacher gives an instruction.', 'We can answer an instruction with "Yes, teacher."'),
      mc("You don't understand. What do you say?", 'Can you say that again, please?', ['Go away!', 'I am happy.', 'It is a ruler.'], 'Ask the teacher to repeat.', '"Can you say that again, please?" asks politely for help.'),
      match('Match each instruction to its picture.', [['Sit down.', P('sit down', 'act:sit')], ['Stand up.', P('stand up', 'act:stand')], ['Read your book.', P('read', 'act:read')], ['Draw a picture.', P('draw', 'act:draw')]], 'Look at what each child is doing.', 'Sit, stand, read and draw are classroom actions.'),
      dlg(REPLY, [['Friend', 'Can I borrow your ruler?'], ['You', null]], 'Sure. Here you are.', ['Yes, I am.', 'It is under the chair.', 'No, I am seven.'], 'Your friend asks for something.', 'We say "Here you are" when we give something.', { glossary: [gloss('borrow', null, 'take something and give it back later', 'Can I borrow your eraser?')] }),
      dlg(REPLY, [['Teacher', 'Who is absent today?'], ['You', null]], 'Hafiz is absent, teacher.', ['I am Hafiz, absent.', 'Absent is today.', 'Thank you, teacher.'], '"Who" asks for a person.', 'We answer "Who ...?" with a person\'s name.', { glossary: [gloss('absent', 'away', 'not at school today', 'Ravi is absent because he is sick.', true)] }),
      mc('Your pencil is broken. What can you say to your teacher?', 'Teacher, my pencil is broken.', ['Teacher, I am broken.', 'Teacher, my pencil is happy.', 'Teacher, pencil broken it.'], 'Say what is broken.', 'Tell the teacher clearly: "My pencil is broken."'),
      order(ORDER, ['Teacher: Good morning, class.', 'Class: Good morning, teacher.', 'Teacher: Please sit down.', 'Class: Thank you, teacher.'], 'The teacher speaks first.', 'Greeting, reply, instruction, thank you.', { kind: 'sequence' }),
      dlg('What do you ask?', [['You', null], ['Friend', 'It is on your table.']], 'Where is my book?', ['What is my book?', 'Who is my book?', 'When is my book?'], 'The answer tells a place.', 'We use "Where" to ask about a place.'),
    ],
  ),
  buildMission(
    { id: 'ee-y2-m1', categoryId: C, yearLevel: 2, order: 1, title: 'At the Café', blurb: 'Order food and drinks.', skill, objective: 'Order food and drinks and ask about prices politely.' },
    [
      dlg(REPLY, [['Waiter', 'What would you like to drink?'], ['You', null]], 'A glass of iced tea, please.', ['I would like a plate, please.', 'I am drinking.', 'Yes, I like.'], 'Name a drink and say "please".', 'Name the drink and add "please".', { image: 'cup' }),
      dlg(REPLY, [['Waiter', 'Anything else?'], ['You', null]], "No, thank you. That's all.", ["Yes, thank you. That's all.", 'I am else.', 'Here you are.'], '"That\'s all" means you don\'t want more.', '"No, thank you. That\'s all." means you have finished ordering.'),
      match('Match each question to its answer.', [['How much is the roti canai?', "It's two ringgit."], ['What would you like?', 'Nasi lemak, please.'], ['Is it spicy?', 'Yes, a little.'], ['Can I have the bill, please?', 'Sure. Here you are.']], '"How much" asks about money.', 'Each question gets an answer that fits it.'),
      order(ORDER, ['Waiter: Hello! What would you like?', 'Mei Ling: Fried noodles, please.', 'Waiter: Here you are.', 'Mei Ling: Thank you.'], 'The waiter speaks first.', 'Ask, order, serve, thank.', { kind: 'sequence' }),
      dlg('What do you ask?', [['You', null], ['Stall owner', "It's three ringgit."]], 'How much is the chicken rice?', ['How many is the chicken rice?', 'What is chicken rice?', 'Where is the chicken rice?'], 'The answer is a price.', '"How much ...?" asks about the price.'),
      mc('You are ready to order. How do you call the waiter politely?', 'Excuse me, can we order, please?', ['Hey you! Come here!', 'Order now!', 'I am ordering you.'], 'Start with "Excuse me".', '"Excuse me ... please" is polite.'),
      dlg(REPLY, [['Waiter', 'Here is your food. Enjoy!'], ['You', null]], 'Thank you very much!', ["You're welcome!", 'Sorry!', 'Goodbye, food!'], 'The waiter gives you food.', 'Say "Thank you" when someone serves you.'),
      dlg(REPLY, [['Friend', 'Do you like roti canai?'], ['You', null]], "Yes, I do. It's delicious!", ['Yes, I am.', 'Yes, it does.', 'No, I does not.'], 'Answer a "Do you ...?" question with "do".', '"Do you like ...?" → "Yes, I do." or "No, I don\'t."', { glossary: [gloss('delicious', null, 'tastes very good', 'This mango is delicious!')] }),
    ],
  ),
  buildMission(
    { id: 'ee-y2-m2', categoryId: C, yearLevel: 2, order: 2, title: 'At the Market', blurb: 'Buy fruit and vegetables.', skill, objective: 'Ask for items, prices and places in a shopping exchange.' },
    [
      dlg(REPLY, [['Seller', 'Good morning! What would you like?'], ['You', null]], 'Some bananas, please.', ['I am bananas, please.', 'Yes, good morning.', 'Bananas are yellow.'], 'Say what you want to buy.', 'Tell the seller what you want and say "please".', { image: 'banana' }),
      dlg('What do you ask?', [['You', null], ['Seller', 'They are five ringgit a kilo.']], 'How much are the mangoes?', ['How much is the mangoes?', 'How many mangoes?', 'Where are the mangoes?'], '"mangoes" is more than one.', 'More than one: "How much are ...?"'),
      mc('The bananas cost too much for you. What can you say politely?', 'Sorry, that is too expensive for me.', ['You are a bad seller!', 'Give me free bananas!', 'Expensive is good.'], 'Be kind and say "Sorry".', 'We can say no politely: "Sorry, that is too expensive for me."', { glossary: [gloss('expensive', null, 'costs a lot of money', 'This toy is too expensive.')] }),
      match('Match each question to its answer.', [['Can I help you?', 'Yes, please. I need some eggs.'], ['How many eggs?', 'Ten, please.'], ['Anything else?', 'No, thank you.'], ["That's six ringgit.", 'Here you are.']], '"How many" needs a number.', 'Each answer fits its question.'),
      order(ORDER, ['Seller: Hello! Can I help you?', 'Danial: Yes. Can I have two watermelons, please?', 'Seller: Sure. That is eight ringgit.', 'Danial: Here you are. Thank you!'], 'Who speaks first at a stall?', 'Greet, ask, price, pay.', { kind: 'sequence' }),
      dlg(REPLY, [['Seller', 'Would you like a plastic bag?'], ['You', null]], 'No, thank you. I have my own bag.', ['No, thank you. I would like a bag.', 'Yes, I am a bag.', 'I like plastic.'], 'Your answer should make sense all the way through.', '"No, thank you. I have my own bag." is polite and makes sense.'),
      dlg('What do you ask?', [['You', null], ['Seller', "They're next to the onions."]], 'Excuse me, where are the potatoes?', ['Excuse me, what are the potatoes?', 'Excuse me, who are the potatoes?', 'Excuse me, are you potatoes?'], 'The answer is a place.', '"Where" asks about a place.'),
      mc('You want to buy one watermelon. What do you say?', 'One watermelon, please.', ['One watermelons, please.', 'Watermelon one, please me.', 'A watermelons, please.'], 'One means no -s.', '"One watermelon, please." One thing has no -s.', { image: 'watermelon' }),
    ],
  ),
  buildMission(
    { id: 'ee-y2-m3', categoryId: C, yearLevel: 2, order: 3, title: 'Asking for Help', blurb: 'Ask for help politely.', skill, objective: 'Ask for and offer help using polite requests.' },
    [
      dlg('What do you ask?', [['You', null], ['Librarian', 'Of course. The animal books are over there.']], 'Excuse me, can you help me find a book about animals?', ['Excuse me, where is my animal?', 'I have a book about animals.', 'Animals are over there.'], 'You need help to find something.', 'Start with "Excuse me" and ask "Can you help me ...?"'),
      mc("You can't find your mother in a shop. What do you say to a shop worker?", "Excuse me, I can't find my mother. Can you help me?", ['Where is the toy shop?', 'I want ice cream.', 'Goodbye, shop.'], 'Say the problem, then ask for help.', 'Tell a shop worker the problem and ask for help.'),
      match('Match each problem to a polite request.', [['Your bag is too heavy.', 'Can you help me carry my bag, please?'], ["You don't understand the question.", 'Can you explain that again, please?'], ["You can't reach a book.", 'Could you pass me that book, please?'], ['You need a pencil.', 'May I borrow a pencil, please?']], 'Read the problem, then find the help you need.', 'Each request asks for the help that fits the problem.'),
      dlg(REPLY, [['Friend', 'Are you okay?'], ['You', null]], 'No, I hurt my knee. Please call the teacher.', ['Yes, I hurt my knee, thank you.', 'No, I am a knee.', 'Yes, please hurt my knee.'], 'You are hurt and need an adult.', 'Say what is wrong and ask for help.'),
      order(ORDER, ["Danial: Excuse me, teacher. I don't understand this question.", 'Teacher: Let me help you. Read it with me.', 'Danial: Oh, I see now. Thank you!'], 'Danial asks first.', 'Ask for help, get help, say thank you.', { kind: 'sequence' }),
      dlg(REPLY, [['Teacher', 'Can I help you?'], ['You', null]], "Yes, please. I can't open my water bottle.", ['Yes, please. I can open my water bottle.', "No, thank you. I can't open my water bottle.", 'Yes, you can help you.'], 'Your reply should ask for help that you need.', '"Yes, please" + the problem asks for help clearly.'),
      mc('Your friend is carrying many books. What can you say?', 'Can I help you?', ['Help me!', "That's my book.", 'You are slow.'], 'Offer to help.', '"Can I help you?" offers help kindly.'),
      dlg('What does the teacher say?', [['You', 'Thank you for helping me.'], ['Teacher', null]], "You're welcome.", ['Thank you.', 'Sorry.', 'Hello.'], 'What do we say after "Thank you"?', 'We answer "Thank you" with "You\'re welcome".'),
    ],
  ),
  buildMission(
    { id: 'ee-y3-m1', categoryId: C, yearLevel: 3, order: 1, title: 'Making Plans', blurb: 'Make plans with friends.', skill, objective: 'Make, accept and politely decline suggestions and invitations.' },
    [
      dlg(REPLY, [['Friend', 'Shall we play badminton after school?'], ['You', null]], "That's a great idea!", ["That's a great pencil!", 'I played it yesterday at school.', 'No, I am badminton.'], 'Your friend makes a suggestion.', '"That\'s a great idea!" accepts a suggestion.'),
      dlg(REPLY, [['Friend', 'Would you like to come to my house on Saturday?'], ['You', null]], "I'd love to, but I have a piano lesson.", ["I'd love to, so I have a piano lesson.", 'Yes, I would like your house.', 'On Saturday is my house.'], 'You want to go, but you are busy.', 'Use "but" to say no politely and give a reason.'),
      match('Match each question to its answer.', [["Let's go to the park.", "Okay, let's go!"], ['What time shall we meet?', "At four o'clock."], ['Where shall we meet?', 'At the school gate.'], ['Who else is coming?', 'Wei Jie and Priya.']], '"What time", "Where" and "Who" need different answers.', 'Time → a time. Where → a place. Who → people.'),
      order(ORDER, ['Priya: Do you want to make a poster with me?', 'Hafiz: Sure! When?', 'Priya: Tomorrow at recess.', 'Hafiz: Great. I will bring my markers.'], 'Who makes the suggestion?', 'Suggest, accept, agree on a time, plan.', { kind: 'sequence' }),
      dlg('What do you ask?', [['You', null], ['Friend', 'Sure! What time?']], 'Do you want to watch a film with me tomorrow?', ['I watched a film yesterday.', 'The film is very long.', 'I like films about animals.'], 'Your friend says "Sure!", so you invited them.', 'An invitation question fits the answer "Sure! What time?"'),
      mc('Your friend invites you, but you cannot go. What is the most polite reply?', "Thank you for asking, but I can't come this time.", ["No. I don't want to.", 'Your party is boring.', 'Maybe. Bye.'], 'Say thank you first.', 'A polite "no" thanks the person and is kind.'),
      dlg(REPLY, [['Friend', "Sorry I'm late!"], ['You', null]], "That's okay. Let's start.", ["You're welcome.", 'Thank you for late.', 'Yes, you are.'], 'Your friend says sorry.', 'We answer "Sorry" with "That\'s okay."'),
      dlg(REPLY, [['Friend', 'How about going swimming on Sunday?'], ['You', null]], "Sounds fun! I'll bring my goggles.", ["Sounds fun! I'll bring my umbrella.", 'I am swimming now Sunday.', 'How about you?'], 'What do you need for swimming?', 'Goggles help you see underwater.', { glossary: [gloss('goggles', null, 'special glasses that keep water out of your eyes', 'I wear goggles in the pool.')] }),
    ],
  ),
  buildMission(
    { id: 'ee-y3-m2', categoryId: C, yearLevel: 3, order: 2, title: 'Shopping and Money', blurb: 'Shop for clothes and books.', skill, objective: 'Ask about price, size and colour, and handle simple problems when shopping.' },
    [
      dlg(REPLY, [['Shop assistant', 'Can I help you?'], ['You', null]], "Yes, I'm looking for a pair of shoes.", ["Yes, I'm looking for a pair of shoe.", 'No, I am help.', 'Yes, you can help you.'], '"a pair of" goes with a plural word.', '"a pair of shoes" — shoes come in twos.'),
      dlg('What do you ask?', [['You', null], ['Shop assistant', 'Yes, we have it in red and black.']], 'Do you have this bag in other colours?', ['How much is this bag?', 'Where is the bag shop?', 'Is this your bag?'], 'The answer is about colours.', 'Asking about "other colours" fits the answer.'),
      mc('Which question asks about the price?', 'How much does this cost?', ['How many does this cost?', 'What colour is this?', 'Where is the cashier?'], 'Price is about money.', '"How much does this cost?" asks about price.'),
      match('Match each question to its answer.', [['What size are you?', 'Size 2, I think.'], ['Would you like to try it on?', 'Yes, please.'], ['How would you like to pay?', 'With cash, please.'], ['Is this a present?', "Yes, it's for my sister."]], 'Pay with cash or card.', 'Each answer fits its question.'),
      order(ORDER, ['Assistant: Good afternoon. Can I help you?', "Wei Jie: Yes. I'd like this storybook, please.", "Assistant: That's nine ringgit.", 'Wei Jie: Here you are. Thank you.'], 'The assistant greets first.', 'Greet, ask, price, pay.', { kind: 'sequence' }),
      dlg(REPLY, [['Cashier', "That's twelve ringgit fifty."], ['You', null]], "Here's fifteen ringgit.", ["Here's ten ringgit.", 'Twelve is my age.', 'Thank you, cashier fifty.'], 'You need to give enough money.', 'RM15 is more than RM12.50, so you get change.'),
      dlg('What do you say?', [['You', null], ['Cashier', "Oh, sorry! Here's your correct change."]], 'Excuse me, I think the change is wrong.', ['Excuse me, I think the shop is wrong.', 'Thank you for the wrong change.', 'Can I have a bag?'], 'The cashier fixes the change.', 'Say "Excuse me" and explain the problem politely.'),
      mc('The shirt is too small. What do you say?', 'Do you have a bigger size, please?', ['Do you have a smaller size, please?', 'This shirt is too big.', "I'll take two small ones."], 'Too small means you need...?', 'If it is too small, ask for a bigger size.', { image: 'shirt' }),
    ],
  ),
  buildMission(
    { id: 'ee-y3-m3', categoryId: C, yearLevel: 3, order: 3, title: 'Kind Words', blurb: 'Be a good friend and neighbour.', skill, objective: 'Respond suitably to feelings, celebrations, apologies and requests.' },
    [
      dlg(REPLY, [['Friend', 'I lost my favourite pen.'], ['You', null]], "Oh no! I'll help you look for it.", ['Good! I like it.', 'That is your problem.', 'My pen is blue.'], 'Your friend is sad.', 'Offering to help shows kindness.'),
      dlg(REPLY, [['Neighbour', 'Happy Hari Raya! Please come in.'], ['You', null]], 'Thank you, and Happy Hari Raya to you too!', ['Thank you, happy birthday!', 'No, I want to go home.', 'Happy New Year, neighbour!'], 'Return the festival greeting.', 'We return a festival greeting and say thank you.'),
      match('What can you say? Match each one.', [['Your friend wins a prize.', 'Congratulations!'], ['Your friend is sick.', 'I hope you feel better soon.'], ['Your friend says sorry.', "That's all right."], ['Your friend is going on holiday.', 'Have a great trip!']], 'Think about how your friend feels.', 'Kind words fit how the other person feels.'),
      order(ORDER, ["Aina: I'm sorry. I stepped on your foot.", "Ravi: It's okay. It doesn't hurt much.", 'Aina: Are you sure?', "Ravi: Yes, I'm fine. Thanks."], 'Who says sorry first?', 'Apology, reply, check, reassure.', { kind: 'sequence' }),
      dlg('What do you say?', [['You', null], ['Classmate', "It's okay. Just be careful next time."]], "I'm sorry I broke your crayon.", ['Thank you for your crayon.', 'Your crayon is broken.', 'Can I have a crayon?'], 'Your classmate forgives you.', '"I\'m sorry ..." is an apology. "It\'s okay" accepts it.'),
      mc('A new pupil joins your class. What can you say?', "Hi, I'm Aina. Would you like to sit with us?", ['Who are you? Go away.', 'This seat is only for my friend.', "I'm Aina. Goodbye."], 'Be welcoming.', 'Saying your name and inviting them in is friendly.'),
      dlg(REPLY, [['Grandmother', 'Could you help me carry these bags, dear?'], ['You', null]], 'Of course, Grandma. Let me take that one.', ['Of course not, Grandma.', 'These bags are yours.', 'I carry bags yesterday.'], '"Of course" means yes.', '"Of course" agrees to help.'),
      dlg(REPLY, [['Friend', 'Thank you for helping me with my homework.'], ['You', null]], 'No problem. Anytime!', ['No, thank you.', 'You are welcome to my homework.', 'Yes, I am homework.'], 'Reply to "thank you".', '"No problem" is a friendly reply to "thank you".'),
    ],
  ),
];
