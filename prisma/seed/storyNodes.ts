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
    prompt: 'You are an adventurer, standing at the edge of a dark, whispering forest. Shadows loom and the air is thick with mystery. Three paths diverge before you, each shrouded in a different aura. The left path glimmers faintly with a strange light, the middle path is lined with eerie, twisted trees, and the right path is overgrown with thick vines. What will you do?',
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
    prompt: 'The middle path leads you to a deep chasm. As you peer over the edge, you lose your footing and tumble into the abyss. You have met your demise.',
    options: [{ text: 'Restart and choose a different path', nextNodeId: 1, result: 'bad' }],
    storyId: 3,
  },
  {
    prompt: 'The right path opens into a hidden cave, its entrance obscured by thick vines. Inside, you find a treasure chest adorned with ancient runes. Do you dare to open the chest?',
    options: [
      { text: 'Open the chest and claim whatever treasures it holds', nextNodeId: 8 },
      { text: 'Inspect the chest for traps before proceeding', nextNodeId: 9 },
      { text: 'Leave the chest and explore deeper into the cave', nextNodeId: 10 },
    ],
    storyId: 4,
  },
  {
    prompt: 'You take the sword, and a surge of energy courses through your veins. The merchant smirks knowingly, as if he anticipated your choice. What will you do next?',
    options: [
      { text: 'Continue down the left path, sword in hand', nextNodeId: 11 },
      { text: 'Return to the fork and explore another path', nextNodeId: 1 },
      { text: 'Ask the merchant for further guidance', nextNodeId: 7 },
    ],
    storyId: 5,
  },
  {
    prompt: 'You refuse the sword. The merchant shrugs, warning that few who reject his offer return unchanged. Where will you go next?',
    options: [
      { text: 'Explore the middle path', nextNodeId: 3 },
      { text: 'Take the right path to the hidden cave', nextNodeId: 4 },
      { text: 'Seek further knowledge from the merchant', nextNodeId: 7 },
    ],
    storyId: 6,
  },
  {
    prompt: 'The merchant leans closer and whispers about a hidden treasure within the cave. He warns you of its dangers, but the promise of riches is tempting. Do you follow his directions?',
    options: [
      { text: 'Yes, follow the directions eagerly', nextNodeId: 10 },
      { text: 'Thank him but choose to explore on your own', nextNodeId: 1 },
      { text: 'Ask him for more details about the dangers', nextNodeId: 9 },
    ],
    storyId: 7,
  },
  {
    prompt: 'You open the chest, revealing ancient artifacts pulsing with energy. Among them lies a map to a greater treasure hidden deeper in the forest. What will you do?',
    options: [
      { text: 'Take the artifacts and the map, and set off immediately', nextNodeId: 11 },
      { text: 'Leave the artifacts and explore the cave further', nextNodeId: 10 },
      { text: 'Take one artifact and return to the merchant', nextNodeId: 7 },
    ],
    storyId: 8,
  },
  {
    prompt: 'You find a trap mechanism on the chest and disarm it. Inside are glowing stones that enhance magical abilities. What will you do?',
    options: [
      { text: 'Take the stones and embrace their magic', nextNodeId: 11 },
      { text: 'Leave the stones and continue exploring', nextNodeId: 10 },
      { text: 'Take the stones and confront the cave’s mysteries', nextNodeId: 12 },
    ],
    storyId: 9,
  },
  {
    prompt: 'You delve deeper into the cave, encountering shimmering crystals and strange creatures. At the center lies an altar with glowing runes. Do you dare to interact with it?',
    options: [
      { text: 'Yes, touch the altar and awaken its power', nextNodeId: 12 },
      { text: 'Study the runes carefully before making a decision', nextNodeId: 8 },
      { text: 'Leave the altar untouched and continue exploring the cave', nextNodeId: 10 },
    ],
    storyId: 10,
  },
  {
    prompt: 'With the sword in hand, you feel empowered. The forest whispers secrets to you, and both allies and enemies await. What is your next move?',
    options: [
      { text: 'Seek out hidden allies in the forest', nextNodeId: 12 },
      { text: 'Prepare for an impending conflict with dark forces', nextNodeId: 8 },
      { text: 'Search for more treasure while harnessing your new power', nextNodeId: 9 },
    ],
    storyId: 11,
  },
  {
    prompt: 'The ancient beast awakens, and you feel the weight of your choices. How will you confront this creature?',
    options: [
      { text: 'Fight the beast with all your might', nextNodeId: 11 },
      { text: 'Attempt to communicate and understand its plight', nextNodeId: 9 },
      { text: 'Use your artifacts to subdue the beast', nextNodeId: 10 },
    ],
    storyId: 12,
  },
];

async function main() {
  await prisma.option.deleteMany({});
  console.log('Deleted all options.');

  await prisma.storyNode.deleteMany({});
  console.log('Deleted all story nodes.');

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

      await prisma.storyNode.update({
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
  .catch((error) => {
    console.error('An error occurred:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
