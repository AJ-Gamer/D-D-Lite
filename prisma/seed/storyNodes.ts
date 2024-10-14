import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Option {
  text: string;
  nextNodeId: number | null;
  result?: string;
}

interface StoryNode {
  prompt: string;
  options: Option[];
  storyId: number;
}

const storyline: StoryNode[] = [
  {
    prompt: 'You are a {class}, standing at the edge of a dark, whispering forest. Shadows loom and the air is thick with mystery. Three paths diverge before you, each shrouded in a different aura. The left path glimmers faintly with a strange light, the middle path is lined with eerie, twisted trees, and the right path is overgrown with thick vines. What will you do?',
    options: [
      { text: 'Take the left path, drawn by the glimmer', nextNodeId: 2 },
      { text: 'Brave the middle path, intrigued by the twisted trees', nextNodeId: 3 },
      { text: 'Venture down the right path, eager to discover what lies beneath the vines', nextNodeId: 4 },
    ],
    storyId: 1,
  },
  {
    prompt: 'As you walk the left path, you encounter a strange merchant, cloaked in vibrant silks. His eyes twinkle with mischief as he presents you with a finely crafted sword, its blade shimmering with an unnatural glow. "This weapon can reveal hidden truths," he claims. Do you take it?',
    options: [
      { text: 'Yes, take the sword and accept the merchant’s offer', nextNodeId: 5 },
      { text: 'No, decline and continue on your journey', nextNodeId: 6 },
      { text: 'Inquire about the sword’s true nature and any consequences', nextNodeId: 7 },
    ],
    storyId: 2,
  },
  {
    prompt: 'The middle path leads you to a deep chasm. As you peer over the edge, you lose your footing and tumble into the abyss, the last sounds you hear are your own screams echoing back at you. You have met your demise.',
    options: [{ text: 'Restart and choose a different path', nextNodeId: 1, result: 'bad' }],
    storyId: 3,
  },
  {
    prompt: 'The right path opens into a hidden cave, its entrance obscured by thick vines. Inside, you find a treasure chest adorned with ancient runes. As you approach, you feel a strange energy emanating from it. Do you dare to open the chest?',
    options: [
      { text: 'Open the chest and claim whatever treasures it holds', nextNodeId: 8 },
      { text: 'Inspect the chest for traps before proceeding', nextNodeId: 9 },
      { text: 'Leave the chest and explore deeper into the cave', nextNodeId: 10 },
    ],
    storyId: 4,
  },
  {
    prompt: 'You take the sword, and as you grip the hilt, a surge of energy courses through your veins. The sword resonates with your spirit, and you feel a sense of purpose and strength. The merchant smirks knowingly, as if he anticipated your choice. What will you do next?',
    options: [
      { text: 'Continue down the left path, sword in hand', nextNodeId: 11 },
      { text: 'Return to the fork and explore another path', nextNodeId: 1 },
      { text: 'Ask the merchant for further guidance', nextNodeId: 12 },
    ],
    storyId: 5,
  },
  {
    prompt: 'You refuse the sword, feeling it might lead you down a dark path. The merchant shrugs and tells you that many have taken his offer, but few have returned. You proceed onward with caution, your resolve unshaken. What do you wish to do next?',
    options: [
      { text: 'Explore the middle path', nextNodeId: 3 },
      { text: 'Take the right path to the hidden cave', nextNodeId: 4 },
      { text: 'Seek further knowledge from the merchant', nextNodeId: 12 },
    ],
    storyId: 6,
  },
  {
    prompt: 'The merchant leans closer and whispers about a hidden treasure within the cave, describing it as “the heart of the forest.” He warns you of the dangers that guard it, but the promise of riches is tempting. Do you follow his directions?',
    options: [
      { text: 'Yes, follow the directions eagerly', nextNodeId: 10 },
      { text: 'Thank him but choose to explore on your own', nextNodeId: 1 },
      { text: 'Ask him for more details about the dangers', nextNodeId: 13 },
    ],
    storyId: 7,
  },
  {
    prompt: 'You open the chest and a blinding light envelops you. Inside, you find a collection of ancient artifacts, each pulsing with a mysterious energy. Among them lies a map that leads to an even greater treasure hidden deeper within the forest. What will you do?',
    options: [
      { text: 'Take the artifacts and the map, and set off immediately', nextNodeId: 14 },
      { text: 'Leave the artifacts and explore the cave further', nextNodeId: 10 },
      { text: 'Take one artifact and return to the merchant', nextNodeId: 15 },
    ],
    storyId: 8,
  },
  {
    prompt: 'You cautiously inspect the chest for traps, and your sharp eyes catch a hidden mechanism. Disarming it, you successfully open the chest to find a set of glowing stones that enhance magical abilities. You have a choice now. What will you do?',
    options: [
      { text: 'Take the stones and embrace their magic', nextNodeId: 14 },
      { text: 'Leave the stones and continue exploring', nextNodeId: 10 },
      { text: 'Take the stones and confront the cave’s mysteries', nextNodeId: 16 },
    ],
    storyId: 9,
  },
  {
    prompt: 'You delve deeper into the cave, encountering strange creatures and shimmering crystals. The air is electric with magic. As you explore, you discover an ancient altar with runes glowing faintly. Do you dare to interact with it?',
    options: [
      { text: 'Yes, touch the altar and awaken its power', nextNodeId: 17 },
      { text: 'Study the runes carefully before making a decision', nextNodeId: 18 },
      { text: 'Leave the altar untouched and continue exploring the cave', nextNodeId: 10 },
    ],
    storyId: 10,
  },
  {
    prompt: 'With the sword now in your possession, you feel an unyielding force guiding your actions. You venture forth, feeling the presence of both allies and enemies nearby. The forest whispers secrets to you. What is your next move?',
    options: [
      { text: 'Seek out hidden allies in the forest', nextNodeId: 19 },
      { text: 'Prepare for an impending conflict with dark forces', nextNodeId: 20 },
      { text: 'Search for more treasure while harnessing your new power', nextNodeId: 14 },
    ],
    storyId: 11,
  },
  {
    prompt: 'The merchant watches you closely as you seek further guidance. He mentions a lost tome of wisdom hidden in the forest, rumored to grant immense knowledge and power. Will you pursue this path?',
    options: [
      { text: 'Yes, ask for directions to the tome', nextNodeId: 21 },
      { text: 'Politely decline and continue your journey', nextNodeId: 1 },
      { text: 'Inquire about the merchant’s own motives', nextNodeId: 22 },
    ],
    storyId: 12,
  },
  {
    prompt: 'You feel drawn to the heart of the forest, where a powerful entity resides. Armed with your newfound knowledge and artifacts, you prepare for a final confrontation. Do you wish to proceed?',
    options: [
      { text: 'Yes, face the entity with all your strength', nextNodeId: 23 },
      { text: 'Try to negotiate and understand its intentions', nextNodeId: 24 },
      { text: 'Retreat and gather more allies first', nextNodeId: 25 },
    ],
    storyId: 14,
  },
  {
    prompt: 'You awaken an ancient force within the cave as you touch the altar. Visions of the forest\'s past and future flood your mind, and you realize the importance of your quest. What will you do with this newfound insight?',
    options: [
      { text: 'Embrace the power and seek to protect the forest', nextNodeId: 26 },
      { text: 'Use the knowledge for personal gain', nextNodeId: 27 },
      { text: 'Share the wisdom with the forest’s inhabitants', nextNodeId: 28 },
    ],
    storyId: 17,
  },
  {
    prompt: 'The runes pulse with energy as you study them closely. You decipher a message that warns of impending doom if the ancient beast is awakened. What will you do with this information?',
    options: [
      { text: 'Take action to prevent the awakening', nextNodeId: 29 },
      { text: 'Seek out allies to help you', nextNodeId: 19 },
      { text: 'Leave the cave and warn the villagers', nextNodeId: 30 },
    ],
    storyId: 18,
  },
  {
    prompt: 'You find yourself in the heart of the forest, face-to-face with the ancient beast. Its eyes glow with a primal hunger. With the sword in hand, you feel the weight of your choices. Do you fight or try to reason with it?',
    options: [
      { text: 'Fight the beast with all your might', nextNodeId: 31 },
      { text: 'Attempt to communicate and understand its plight', nextNodeId: 32 },
      { text: 'Use your artifacts to try and subdue it', nextNodeId: 33 },
    ],
    storyId: 23,
  },
  {
    prompt: 'You’ve defeated the beast, but not without sacrifice. The forest is safe, but the balance of power has shifted. What do you choose to do now?',
    options: [
      { text: 'Rule the forest with your newfound strength', nextNodeId: 34 },
      { text: 'Join forces with the remaining forest spirits to maintain peace', nextNodeId: 35 },
      { text: 'Leave the forest to seek new adventures', nextNodeId: 36 },
    ],
    storyId: 31,
  },
];


async function main() {
  const createdStoryNodes: { [key: number]: number } = {};

  await Promise.all(
    storyline.map(async (node) => {
      const createdNode = await prisma.storyNode.create({
        data: {
          prompt: node.prompt,
          storyId: node.storyId,
        },
      });
      createdStoryNodes[node.storyId] = createdNode.id;
    })
  );

  console.log('Created story nodes:', createdStoryNodes);

  await Promise.all(
    storyline.map(async (node) => {
      const optionsData = node.options.map((option) => ({
        text: option.text,
        nextNodeId: option.nextNodeId !== null ? createdStoryNodes[option.nextNodeId] : null,
        result: option.result,
      }));

      console.log(`Updating node with options:`, {
        nodeId: createdStoryNodes[node.storyId],
        optionsData,
      });

      return prisma.storyNode.update({
        where: { id: createdStoryNodes[node.storyId] },
        data: {
          options: {
            create: optionsData,
          },
        },
      });
    })
  );

  console.log('All story nodes and options added to the database!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
