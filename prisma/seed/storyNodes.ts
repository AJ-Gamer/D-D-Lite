import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Option {
  text: string;
  nextNodeId: number | null;
  result?: string;
  statCheck?: {
    stat: string; // The stat to check (e.g., 'strength', 'dexterity')
    difficulty: number; // The difficulty to beat
  };
}

interface StoryNode {
  prompt: string;
  options: Option[];
  storyId: number;
}

const storyline: StoryNode[] = [
  {
    prompt: 'King Aldrith summons you to his royal court. The kingdom is in grave danger. Malthir, a dark wizard, has stolen the Dragon Stone and plans to summon Ragnarth, the Apocalypse Dragon, to bring ruin upon the world. He tasks you with retrieving the artifact and stopping Malthir before it’s too late.',
    options: [
      { text: 'Accept the king\'s quest and set out immediately', nextNodeId: 2 },
      { text: 'Ask the king for more information about Malthir and the Dragon Stone', nextNodeId: 3 },
      { text: 'Refuse the king\'s quest and plan to steal the Dragon Stone for yourself', nextNodeId: 4 },
    ],
    storyId: 1,
  },
  {
    prompt: 'You begin your journey, traveling through the Wilds of Aethora. The path is treacherous, and the forest is dense with dangerous creatures. As you move forward, you spot a figure lurking in the trees—it’s Jarek, an infamous assassin.',
    options: [
      { text: 'Confront Jarek and demand to know why he\'s following you', nextNodeId: 5 },
      { text: 'Attempt to sneak around him and avoid a confrontation', nextNodeId: 6, statCheck: { stat: 'dexterity', difficulty: 14 } },
      { text: 'Attack Jarek before he gets the chance to strike', nextNodeId: 7, statCheck: { stat: 'strength', difficulty: 15 } },
    ],
    storyId: 2,
  },
  {
    prompt: 'King Aldrith provides you with more details about Malthir: the wizard was once a scholar of ancient magic, but his obsession with dragonkind led him to dabble in forbidden rituals. The Dragon Stone holds the blood magic of dragons, and Malthir plans to use it to summon Ragnarth, who can reshape the world in his image. The king warns you that time is running out.',
    options: [
      { text: 'Thank the king for the information and set off on your journey', nextNodeId: 2 },
      { text: 'Ask about allies or resources to help you on your journey', nextNodeId: 8 },
      { text: 'Inquire about any weaknesses Malthir may have', nextNodeId: 9 },
    ],
    storyId: 3,
  },
  {
    prompt: 'You’ve decided to steal the Dragon Stone for yourself. As you start to leave the castle, you’re confronted by the royal guards.',
    options: [
      { text: 'Fight the guards and continue', nextNodeId: 10, statCheck: { stat: 'strength', difficulty: 13 } },
      { text: 'Attempt to talk your way out of the situation', nextNodeId: 11, statCheck: { stat: 'charisma', difficulty: 14 } },
    ],
    storyId: 4,
  },
  {
    prompt: 'Jarek looks at you with a grin, acknowledging you’ve noticed him. "I was hired to make sure you never reach Malthir. I’m sure you know what that means for you." The two of you draw swords.',
    options: [
      { text: 'Fight Jarek with all your strength', nextNodeId: 12, statCheck: { stat: 'strength', difficulty: 15 } },
      { text: 'Dodge his attack and run', nextNodeId: 13, statCheck: { stat: 'dexterity', difficulty: 14 } },
    ],
    storyId: 5,
  },
  {
    prompt: 'Jarek pauses to observe the area carefully before he smirks and pulls out a dagger, aiming for your side.',
    options: [
      { text: 'Dodge his attack and counterattack', nextNodeId: 14, statCheck: { stat: 'dexterity', difficulty: 14 } },
      { text: 'Take the hit and press forward', nextNodeId: 15, statCheck: { stat: 'constitution', difficulty: 15 } },
    ],
    storyId: 6,
  },
  {
    prompt: 'Jarek reacts quickly, dodging your strike and countering with a deadly slash. You are forced to defend yourself.',
    options: [
      { text: 'Block his attack and retaliate', nextNodeId: 12, statCheck: { stat: 'dexterity', difficulty: 15 } },
      { text: 'Try to disarm him', nextNodeId: 13, statCheck: { stat: 'strength', difficulty: 14 } },
    ],
    storyId: 7,
  },
  {
    prompt: 'The king’s adivsors shake their heads with pitying looks as the king declines. "There is no one in this castle with your capabilities nor resources I can spare you."',
    options: [
      { text: 'Simply bow your head and depart on your journey', nextNodeId: 2, statCheck: { stat: 'dexterity', difficulty: 15 } },
      { text: 'Narrow your eyes at the king’s greed before departing', nextNodeId: 2, statCheck: { stat: 'strength', difficulty: 14 } },
    ],
    storyId: 8,
  },
  {
    prompt: 'The king mentions that Malthir’s weakness lies in his inability to control the power of the Dragon Stone for long periods of time.',
    options: [
      { text: 'Use this knowledge to prepare for a battle with the wizard as you leave the castle', nextNodeId: 2 },
      { text: 'Seek more information on the Dragon Stone’s origins', nextNodeId: 16 },
    ],
    storyId: 9,
  },
  {
    prompt: 'Although nervous at first, you make short work of the guards and quickly escape the city below the castle.',
    options: [
      { text: 'Head into the forest towards Malthir’s fortress.', nextNodeId: 2 },
      { text: 'Apologize to the guards that are still awake as you leave for the dragon stone', nextNodeId: 2 },
    ],
    storyId: 10,
  },
  {
    prompt: 'The guards ignore anything you say as they tell you they have been ordered to arrest you for treason.',
    options: [
      { text: 'Laugh awkwardly before running away', nextNodeId: 17, statCheck: { stat: 'dexterity', difficulty: 14 } },
      { text: 'Convince them that denying the king’s wishes is not treason', nextNodeId: 20, statCheck: { stat: 'charisma', difficulty: 14 } },
    ],
    storyId: 11,
  },
  {
    prompt: 'The battle with Jarek rages on. You’re getting tired, but your resolve is strong.',
    options: [
      { text: 'Make a final push and attack with all your might', nextNodeId: 14, statCheck: { stat: 'strength', difficulty: 15 } },
      { text: 'Try to trick Jarek into giving you an opening', nextNodeId: 13, statCheck: { stat: 'charisma', difficulty: 14 } },
    ],
    storyId: 12,
  },
  {
    prompt: 'You push forward with all your might, landing a blow that knocks Jarek off balance. He stumbles, but quickly recovers and readies himself for another strike.',
    options: [
      { text: 'Take advantage of his momentary weakness and strike again', nextNodeId: 14, statCheck: { stat: 'strength', difficulty: 10} },
      { text: 'Back away and attempt to catch your breath', nextNodeId: 18, statCheck: { stat: 'constitution', difficulty: 10} },
    ],
    storyId: 13,
  },
  {
    prompt: 'Jarek falls to the ground with a loud crash, defeated. With his last breath, he mutters, "The wizard will not be so easy to defeat." You stand victorious.',
    options: [
      { text: 'Continue your journey to Malthir’s fortress', nextNodeId: 19 },
    ],
    storyId: 14,
  },
  {
    prompt: 'You run while keeping a firm grasp on the dagger in your side, deciding to retreat into the forest to avoid further conflict. You eventually escape Jarek and journey continues as you take care of your wound.',
    options: [
      { text: 'Stop to rest at the next clearing', nextNodeId: 16},
      { text: 'Keep moving forward towards the dark wizard’s fortress', nextNodeId: 19 },
    ],
    storyId: 15,
  },
  {
    prompt: 'You find an ancient shrine deep in the forest, surrounded by old stones. It is dedicated to the Dragon Stone and contains inscriptions that speak of its origins and the power it holds. The shrine reveals that the Dragon Stone can only be used by one who can truly control its magic, and that Malthir is at great risk of losing control during the summoning.',
    options: [
      { text: 'Study the inscriptions at the shrine for more information', nextNodeId: 17 },
      { text: 'Rest and recover your strength in the clearing', nextNodeId: 18 },
    ],
    storyId: 16,
  },
  {
    prompt: 'As you study the shrine’s inscriptions, you learn that the Dragon Stone was originally created by an ancient civilization to bind the power of dragons. Malthir may be able to summon Ragnarth, but he will not be able to control it for long. The key to stopping Malthir lies in understanding the stone’s magic.',
    options: [
      { text: 'Continue your journey towards Malthir’s fortress', nextNodeId: 19 },
    ],
    storyId: 17,
  },
  {
    prompt: 'You rest in the clearing and prepare your body for the coming battle. While it is peaceful here, you know that time is running out. The journey to Malthir’s fortress must continue.',
    options: [
      { text: 'Continue your journey towards Malthir’s fortress', nextNodeId: 19 },
    ],
    storyId: 18,
  },
  {
    prompt: 'You arrive at the dark wizard’s fortress, looming in the distance. The air is thick with dark magic, and the castle seems to pulse with an unnatural energy.',
    options: [
      { text: 'Prepare to confront Malthir in the fortress', nextNodeId: 20 },
    ],
    storyId: 19,
  },
  {
    prompt: 'You arrive at the dark wizard’s fortress, looming in the distance. The air is thick with dark magic, and the castle seems to pulse with an unnatural energy.',
    options: [
      { text: 'Sneak around the fortress to look for the Dragon Stone', nextNodeId: 21 },
      { text: 'Call out for Malthir and challenge him directly', nextNodeId: 22 },
    ],
    storyId: 20,
  },
  {
    prompt: 'You move cautiously around the fortress, searching for a way to find the Dragon Stone undetected. You see two possible entry points.',
    options: [
      { text: 'Search the armory', nextNodeId: 23 },
      { text: 'Look for a trophy room', nextNodeId: 24 },
    ],
    storyId: 21,
  },
  {
    prompt: 'You shout for Malthir, and his laughter echoes from the depths of the fortress. The wizard steps out of the shadows, holding the Dragon Stone. "You’re too late," he sneers, mocking your efforts.',
    options: [
      { text: 'Charge Malthir head-on', nextNodeId: 29 },
    ],
    storyId: 22,
  },
  {
    prompt: 'The armory is heavily guarded, but you’re determined to find the Dragon Stone. You can try to fight the guards or create a distraction.',
    options: [
      { text: 'Fight the guards head-on', nextNodeId: 25, statCheck: { stat: 'strength', difficulty: 10 } },
      { text: 'Distract the guards by sparking your blade to start a small fire', nextNodeId: 26, statCheck: { stat: 'dexterity', difficulty: 10 } },
    ],
    storyId: 23,
  },
  {
    prompt: 'You enter the trophy room, but guards spot you and charge forward to attack. There’s no choice but to defend yourself.',
    options: [
      { text: 'Fight off the guards', nextNodeId: 22, statCheck: { stat: 'strength', difficulty: 12 } },
    ],
    storyId: 24,
  },
  {
    prompt: 'You engage the guards in battle, managing to overcome them after a fierce struggle. With the guards defeated, you enter the armory.',
    options: [
      { text: 'Enter the armory', nextNodeId: 27 },
    ],
    storyId: 25,
  },
  {
    prompt: 'You manage to create a distraction, and the guards rush to extinguish the small fire. You slip into the armory while they are preoccupied.',
    options: [
      { text: 'Enter the armory', nextNodeId: 27 },
    ],
    storyId: 26,
  },
  {
    prompt: 'Inside the armory, you search but find no sign of the Dragon Stone. Suddenly, the ground begins to shake violently. A dark energy pulses from below.',
    options: [
      { text: 'Rush toward the source of the vile magic', nextNodeId: 28 },
    ],
    storyId: 27,
  },
  {
    prompt: 'Feeling the surge of dark magic, you dash down into Malthir’s dungeon. The air is thick with malevolent energy. Malthir stands before an ancient altar, holding the Dragon Stone high as he begins his summoning ritual. He sneers at you over his shoulder. "Witness the beginning of the end!"',
    options: [
      { text: 'Interrupt the ritual and confront Malthir with a direct attack', nextNodeId: 30 },
    ],
    storyId: 28,
  },
  {
    prompt: 'Malthir teleports deeper into the dungeon, preparing to begin the ritual in earnest. The ground shakes, and dark magic spreads throughout the fortress.',
    options: [
      { text: 'Pursue Malthir into the depths of the dungeon', nextNodeId: 28 },
    ],
    storyId: 29,
  },
  {
    prompt: `You yell out as you swing your {weapon} towards Malthir only for it stop midair against a magical barrier while he laughs in your face as he turns back towards his unholy altar.`,
    options: [
      { text: 'Growl in anger as you desperately attack the barrier without rest', nextNodeId: 31 },
      { text: 'Stare at the barrier worriedly before you smirk nervously and taunt Malthir for hiding', nextNodeId: 32 },
      { text: 'step back and survey the room quickly before you notices an engraved magic circle on the ground', nextNodeId: 33 },
    ],
    storyId: 30,
  },
  {
    prompt: `You pant heavily as you keep swinging your sword determinedly, your hope rising with each crack sliced into the barrier until it finally shatters, leaving Malthir vulnerable.`,
    options: [
      { text: 'Seize your chance and thrust your sword into his back!', nextNodeId: 34 },
      { text: 'Tackle Malthir away from the alter and knock the Dragon Stone out of his hands', nextNodeId: 35 },
      { text: 'Rest your sword on Malthir’s shoulder "Give up Malthir."', nextNodeId: 32},
    ],
    storyId: 31,
  },
  {
    prompt: `Malthir frowns for a moment before his eyes glow brightly and releases a wave of magic that carries you away from him while he fully turns around to sneer at you. "I will enjoy killing you."`,
    options: [
      { text: 'Stand up straight and prepare yourself as you stare down the dark wizard', nextNodeId: 36 },
    ],
    storyId: 32,
  },
  {
    prompt: `You take your sword and drag it through the magic circle while Malthir was attempeting to activate it, causing a massive explosion as the magical energy released from it's broken rune violently.`,
    options: [
      { text: 'Get flung back towards the entrance before you slam into the wall', nextNodeId: 37 },
    ],
    storyId: 33,
  },
  {
    prompt: `You take a deep breath as you feel Malthir shake around your blade before you realize he was laughing as his blood dripped onto the Dragon Stone as both it and the magic circle you were both standing in glows brighter`,
    options: [
      { text: 'Stagger backwards in horror', nextNodeId: 38 },
    ],
    storyId: 34,
  },
  {
    prompt: `Malthir attempts to gather magic for a spell but you slam the pommel of your sword into his forehead, causing him to be dazed.`,
    options: [
      { text: 'Get up and grab the Dragon Stone', nextNodeId: 39 },
      { text: 'Stand up and stab Malthir in the heart', nextNodeId: 40 }
    ],
    storyId: 35,
  },
  {
    prompt: `Malthir covers himself in an aura of magic before he lifts the hand holding the Dragon Stone towards you and releases a wave of fire.`,
    options: [
      { text: 'Quickly dodge to the left', nextNodeId: 41 },
      { text: 'Quickly dodge to the right', nextNodeId: 42 }
    ],
    storyId: 36,
  },
  {
    prompt: `You slowly look up in a daze, your vision swimming as the smoke in the dungeon slowly clears to reveal a furious and injured Malthir standing before you.`,
    options: [
      { text: 'look up at him tiredly before you notice a dim glow behind him', nextNodeId: 43 },
    ],
    storyId: 37,
  },
  {
    prompt: `You stare in horror as a massive rift opens from the edge of the magic circle before an unholy roar escaped from wihin it as the Apoloypse Dragon crossed into your world, signifying the end of all living things.`,
    options: [
      { text: 'Bad Ending', nextNodeId: 38 },
    ],
    storyId: 38,
  },
  {
    prompt: `Stare at the Dragon Stone as you feel its power almost pulsating in your hand temptingly while you hear Malthir slowly climb to his feet behind you.`,
    options: [
      { text: 'Destroy the stone!', nextNodeId: 44 },
      { text: 'Use the stone!', nextNodeId: 45 }
    ],
    storyId: 39,
  },
  {
    prompt: `You stand over Malthir's body triumphantly before you collect the Dragon Stone. You rest in Malthir's fortress, realizing that his minions had all fled before you return the Kingdom as a hero.`,
    options: [
      { text: 'Good ending', nextNodeId: 40 }
    ],
    storyId: 40,
  },
  {
    prompt: `You run as fast as you can, dodging waves of fire, bolts of lighting, blasts of wind, and blades of ice as you notice Malthir exhuasting himself with his overuse of the Dragon Stone`,
    options: [
      { text: 'Wait for the next break in attacks and throw your sword at him', nextNodeId: 46 }
    ],
    storyId: 41,
  },
  {
    prompt: `The wave of fire clips your arm as you dive to the ground, and it quickly spreads over the rest of your body, consuming you as Malthir turned back towards his alter uncaringly.`,
    options: [
      { text: 'Bad Ending', nextNodeId: 42 }
    ],
    storyId: 42,
  },
  {
    prompt: `You stare at the shattered remains of the Dragon Stone for a few moments before you chuckle weakly even as Malthir conjures a dagger made of his own blood and plunges it into your chest.`,
    options: [
      { text: 'Good Ending', nextNodeId: 43 }
    ],
    storyId: 43,
  },
  {
    prompt: `You grip the stone tightly before you place it on the ground and raise your sword above your head as Malthir starts charging up an attack "NOOOO!`,
    options: [
      { text: 'Exhale sharply before you plunge your sword into the stone and crack it in half before magic energy exploded from it flinging you backwards', nextNodeId: 37 }
    ],
    storyId: 44,
  },
  {
    prompt: `You grip the stone tightly before you turn towards Malthir and let out a primal roar as you release the energy surging through you from the stone towards him.`,
    options: [
      { text: 'Admire the aftermath', nextNodeId: 47 }
    ],
    storyId: 45,
  },
  {
    prompt: `Malthir looks at your sword in surprise before he bats it away with a wave of magic, unintentionally taking his eyes off of you as you rushed towards him from the side`,
    options: [
      { text: 'Tackle Malthir and pin down his hand with the stone', nextNodeId: 48 }
    ],
    storyId: 46,
  },
  {
    prompt: `You stare at the ashes that used to be Malthir in morbid surprise before you look at the Dragon Stone in awe as it's energy continues to course through you. Should you keep the stone for yourself now that Malthir is dead or do you return the artifact to the kingdom?`,
    options: [
      { text: 'Keep the Dragon Stone', nextNodeId: 49 },
      { text: 'Return the Dragon Stone', nextNodeId: 50 }
    ],
    storyId: 47,
  },
  {
    prompt: `You press your elbow into Malthir's throat as you kneel on his left arm and keep his right arm pinned by the wrist as he glares up at you scornfully`,
    options: [
      { text: 'Try to rest the stone free of his hand', nextNodeId: 51},
      { text: 'Knock him out', nextNodeId: 52 }
    ],
    storyId: 48,
  },
  {
    prompt: `You decide to keep the Dragon Stone for yourself and learn it's secrets, although you won't learn of its corrupting properties until it is too late... for everyone else.`,
    options: [
      { text: 'Bad Ending', nextNodeId: 49 }
    ],
    storyId: 49,
  },
  {
    prompt: `You decide to return the Dragon Stone to King Aldrith and you become a legendary hero of the Kingdom of Aethora. You go on a few more adventures to grow your legend, but eventually you retire and live a long and happy life.`,
    options: [
      { text: 'Good Ending', nextNodeId: 50 }
    ],
    storyId: 50,
  },
  {
    prompt: `Malthir, feeling his grip weaken as you continue to try and take the Dragon Stone, closes his eyes in resignation. Knowing defeat is close, Malthir overloads his body with the stone's power before he exploded, instantly killing himself and taking you down with him. You saved the world, but no one will ever know.`,
    options: [
      { text: 'Bad Ending', nextNodeId: 51},
    ],
    storyId: 51,
  },
  {
    prompt: `You slam your fist into Malthir's face, knocking him out immediately. You tie him up and secure the Dragon Stone before you return to King Aldrith as a hero.`,
    options: [
      { text: 'Good Ending', nextNodeId: 52 }
    ],
    storyId: 52,
  },
];

async function upsertWithRetry(node: StoryNode, retries = 5): Promise<void> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await prisma.storyNode.upsert({
        where: { storyId: node.storyId },
        update: {
          prompt: node.prompt,
          options: {
            deleteMany: {},
            create: node.options.map((option) => ({
              text: option.text,
              nextNodeId: option.nextNodeId !== null ? option.nextNodeId : null,
              result: option.result,
            })),
          },
        },
        create: {
          prompt: node.prompt,
          storyId: node.storyId,
          options: {
            create: node.options.map((option) => ({
              text: option.text,
              nextNodeId: option.nextNodeId !== null ? option.nextNodeId : null,
              result: option.result,
            })),
          },
        },
      });
      console.log(`Upserted story node with storyId ${node.storyId}`);
      return; // Success, exit the retry loop
    } catch (error: any) { 
      if (error.code === 'P2034') {
        // Retry on deadlock or write conflict error
        console.log(`Write conflict on storyId ${node.storyId}, retrying... (attempt ${attempt + 1})`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
      } else {
        throw error; // Rethrow other errors
      }
    }
  }
  console.error(`Failed to upsert story node with storyId ${node.storyId} after ${retries} attempts.`);
}

async function main() {
  await Promise.all(
    storyline.map((node) => upsertWithRetry(node))
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
