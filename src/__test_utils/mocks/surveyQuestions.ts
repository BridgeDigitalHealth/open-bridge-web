import {ChoiceQuestion, Step} from '@typedefs/surveys'

const steps: (Step | ChoiceQuestion)[] = [
  {
    type: 'overview',
    identifier: 'overview',
    title: 'Example Survey A',
    detail:
      'You will be shown a series of example questions. This survey has no additional instructions.',
  },
  {
    type: 'choiceQuestion',
    identifier: 'choiceQ1',
    comment:
      'Go to the question selected by the participant. If they skip the question then go directly to follow-up.',
    title: 'Choose which question to answer',
    surveyRules: [
      {
        skipToIdentifier: 'followupQ',
      },
      {
        matchingAnswer: 1,
        skipToIdentifier: 'simpleQ1',
      },
      {
        matchingAnswer: 2,
        skipToIdentifier: 'simpleQ2',
      },
      {
        matchingAnswer: 3,
        skipToIdentifier: 'simpleQ3',
      },
      {
        matchingAnswer: 4,
        skipToIdentifier: 'simpleQ4',
      },
      {
        matchingAnswer: 5,
        skipToIdentifier: 'simpleQ5',
      },
      {
        matchingAnswer: 6,
        skipToIdentifier: 'simpleQ6',
      },
    ],
    baseType: 'integer',
    singleChoice: true,
    choices: [
      {
        value: 1,
        text: 'Enter some text',
      },
      {
        value: 2,
        text: 'Birth year',
      },
      {
        value: 3,
        text: 'Likert Scale',
      },
      {
        value: 4,
        text: 'Sliding Scale',
      },
      {
        value: 5,
        text: 'Duration',
      },
      {
        value: 6,
        text: 'Time',
      },
    ],
  },
  {
    type: 'simpleQuestion',
    identifier: 'simpleQ1',
    nextStepIdentifier: 'followupQ',
    title: 'Enter some text',
    inputItem: {
      type: 'string',
      placeholder: 'I like cake',
    },
  },
  {
    type: 'simpleQuestion',
    identifier: 'simpleQ2',
    nextStepIdentifier: 'followupQ',
    title: 'Enter a birth year',
    inputItem: {
      type: 'year',
      fieldLabel: 'year of birth',
      placeholder: 'YYYY',
      formatOptions: {
        allowFuture: false,
        minimumYear: 1900,
      },
    },
  },
  {
    type: 'simpleQuestion',
    identifier: 'simpleQ3',
    nextStepIdentifier: 'followupQ',
    title: 'How much do you like apples?',
    uiHint: 'likert',
    inputItem: {
      type: 'integer',
      formatOptions: {
        maximumLabel: 'Very much',
        maximumValue: 7,
        minimumLabel: 'Not at all',
        minimumValue: 1,
      },
    },
  },
  {
    type: 'simpleQuestion',
    identifier: 'simpleQ4',
    nextStepIdentifier: 'followupQ',
    title: 'How much do you like apples?',
    uiHint: 'slider',
    inputItem: {
      type: 'integer',
      formatOptions: {
        maximumLabel: 'Very much',
        maximumValue: 100,
        minimumLabel: 'Not at all',
        minimumValue: 0,
      },
    },
  },
  {
    type: 'simpleQuestion',
    identifier: 'simpleQ5',
    nextStepIdentifier: 'followupQ',
    title: 'How long does it take to travel to the moon?',
    inputItem: {
      type: 'duration',
    },
  },
  {
    type: 'simpleQuestion',
    identifier: 'simpleQ6',
    nextStepIdentifier: 'followupQ',
    title: 'What time is it on the moon?',
    inputItem: {
      type: 'time',
    },
  },
  {
    type: 'choiceQuestion',
    identifier: 'followupQ',
    title: 'Are you happy with your choice?',
    subtitle: 'After thinking it over...',
    detail:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    surveyRules: [
      {
        matchingAnswer: false,
        skipToIdentifier: 'choiceQ1',
      },
    ],
    baseType: 'boolean',
    singleChoice: true,
    choices: [
      {
        value: true,
        text: 'Yes',
      },
      {
        value: false,
        text: 'No',
      },
    ],
  },
  {
    type: 'choiceQuestion',
    identifier: 'favoriteFood',
    title: 'What are you having for dinner next Tuesday after the soccer game?',
    subtitle: 'After thinking it over...',
    detail:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    surveyRules: [
      {
        matchingAnswer: 'Pizza',
        skipToIdentifier: 'multipleChoice',
        ruleOperator: 'ne',
      },
    ],
    baseType: 'string',
    singleChoice: true,
    choices: [
      {
        value: 'Pizza',
        text: 'Pizza',
      },
      {
        value: 'Sushi',
        text: 'Sushi',
      },
      {
        value: 'Ice Cream',
        text: 'Ice Cream',
      },
      {
        value: 'Beans & Rice',
        text: 'Beans & Rice',
      },
      {
        value: 'Tofu Tacos',
        text: 'Tofu Tacos',
      },
      {
        value: 'Bucatini Alla Carbonara',
        text: 'Bucatini Alla Carbonara',
      },
      {
        value: 'Hot Dogs, Kraft Dinner & Potato Salad',
        text: 'Hot Dogs, Kraft Dinner & Potato Salad',
      },
    ],
    other: {
      type: 'string',
    },
  },
  {
    type: 'instruction',
    identifier: 'pizza',
    title: 'Mmmmm, pizza...',
  },
  {
    type: 'choiceQuestion',
    identifier: 'multipleChoice',
    actions: {
      goForward: {
        buttonTitle: 'Submit',
        type: 'default',
      },
    },
    title: 'What are your favorite colors?',
    baseType: 'string',
    singleChoice: false,
    choices: [
      {
        value: 'Blue',
        text: 'Blue',
      },
      {
        value: 'Yellow',
        text: 'Yellow',
      },
      {
        value: 'Red',
        text: 'Red',
      },
      {
        text: 'All of the above',
        selectorType: 'all',
      },
      {
        text: "I don't have any",
        selectorType: 'exclusive',
      },
    ],
    other: {
      type: 'string',
    },
  },
  {
    type: 'completion',
    identifier: 'completion',
    title: "You're done!",
  },
]

export default steps
