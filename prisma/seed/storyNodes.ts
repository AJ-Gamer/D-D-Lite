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
    prompt: 'You find yourself in a dark forest. Three paths lie ahead of you.',
    options: [
      { text: 'Take the left path', nextNodeId: 2 },
      { text: 'Take the middle path', nextNodeId: 3 },
      { text: 'Take the right path', nextNodeId: 4 },
    ],
    storyId: 1,
  },
  {
    prompt: 'You encounter a strange merchant. He offers you a sword. Do you take it?',
    options: [
      { text: 'Yes', nextNodeId: 5 },
      { text: 'No', nextNodeId: 6 },
      { text: 'Ask for directions instead', nextNodeId: 7 },
    ],
    storyId: 2,
  },
  {
    prompt: 'The middle path leads to a deep chasm. You fall and die.',
    options: [{ text: 'Restart', nextNodeId: 1, result: 'bad' }],
    storyId: 3,
  },
  {
    prompt: 'The right path leads to a hidden cave. A treasure chest awaits.',
    options: [{ text: 'Open the chest', nextNodeId: 8 }],
    storyId: 4,
  },
  {
    prompt: 'You take the sword. A sense of power surges through you.',
    options: [{ text: 'Continue', nextNodeId: 8 }],
    storyId: 5,
  },
  {
    prompt: 'You refuse the sword and move on.',
    options: [{ text: 'Continue', nextNodeId: 8 }],
    storyId: 6,
  },
  {
    prompt: 'The merchant gives you directions to the treasure.',
    options: [{ text: 'Follow the directions', nextNodeId: 8 }],
    storyId: 7,
  },
  {
    prompt: 'You reach the treasure and claim victory. You’ve won the game!',
    options: [{ text: 'Play Again', nextNodeId: 1, result: 'good' }],
    storyId: 8,
  },
];

async function main() {
  const createdStoryNodes: { [key: number]: number } = {};

  await Promise.all(
    storyline.map(async (node, index) => {
      const createdNode = await prisma.storyNode.create({
        data: {
          prompt: node.prompt,
          storyId: node.storyId,
        },
      });
      createdStoryNodes[index + 1] = createdNode.id;
    })
  );

  console.log('Created story nodes:', createdStoryNodes);

  await Promise.all(
    storyline.map(async (node, index) => {
      const optionsData = node.options.map((option) => ({
        text: option.text,
        nextNodeId: option.nextNodeId !== null ? createdStoryNodes[option.nextNodeId] : null,
        result: option.result,
      }));

      console.log(`Updating node with options:`, {
        nodeId: createdStoryNodes[index + 1],
        optionsData,
      });

      return prisma.storyNode.update({
        where: { id: createdStoryNodes[index + 1] },
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
