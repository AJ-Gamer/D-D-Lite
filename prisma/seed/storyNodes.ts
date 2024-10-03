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
}

const storyline: StoryNode[] = [
  {
    prompt: 'You find yourself in a dark forest. Three paths lie ahead of you.',
    options: [
      { text: 'Take the left path', nextNodeId: 1 },
      { text: 'Take the middle path', nextNodeId: 2 },
      { text: 'Take the right path', nextNodeId: 3 },
    ],
  },
  {
    prompt: 'You encounter a strange merchant. He offers you a sword. Do you take it?',
    options: [
      { text: 'Yes', nextNodeId: 4 },
      { text: 'No', nextNodeId: 5 },
      { text: 'Ask for directions instead', nextNodeId: 6 },
    ],
  },
  {
    prompt: 'The middle path leads to a deep chasm. You fall and die.',
    options: [{ text: 'Restart', nextNodeId: 0, result: 'bad' }],
  },
  {
    prompt: 'The right path leads to a hidden cave. A treasure chest awaits.',
    options: [{ text: 'Open the chest', nextNodeId: 7 }],
  },
  {
    prompt: 'You take the sword. A sense of power surges through you.',
    options: [{ text: 'Continue', nextNodeId: 7 }],
  },
  {
    prompt: 'You refuse the sword and move on.',
    options: [{ text: 'Continue', nextNodeId: 7 }],
  },
  {
    prompt: 'The merchant gives you directions to the treasure.',
    options: [{ text: 'Follow the directions', nextNodeId: 7 }],
  },
  {
    prompt: 'You reach the treasure and claim victory. You’ve won the game!',
    options: [{ text: 'Play Again', nextNodeId: 0, result: 'good' }],
  },
];

async function main() {
  // Step 1: Create all story nodes without options
  const createdStoryNodes = await Promise.all(
    storyline.map((node) => {
      return prisma.storyNode.create({
        data: {
          prompt: node.prompt,
        },
      });
    })
  );

  // Step 2: Update each story node with its options (including nextNodeId references)
  await Promise.all(
    storyline.map((node, index) => {
      const optionsData = node.options.map((option) => ({
        text: option.text,
        nextNodeId: option.nextNodeId !== null ? createdStoryNodes[option.nextNodeId].id : null, // Reference the created node IDs
        result: option.result,
      }));

      return prisma.storyNode.update({
        where: { id: createdStoryNodes[index].id },
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
