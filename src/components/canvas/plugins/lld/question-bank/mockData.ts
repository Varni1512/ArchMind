import { LLDQuestion } from './types';

export const mockQuestions: LLDQuestion[] = [
  {
    id: 'q-1',
    title: 'Design a Parking Lot',
    difficulty: 'Medium',
    category: 'Real World Systems',
    description: 'Design an object-oriented system for a multi-floor parking lot.',
    requirements: [
      'The parking lot should have multiple floors.',
      'It should support different types of vehicles: motorcycles, cars, and buses.',
      'It should have multiple entry and exit points.',
      'Customers can collect a parking ticket from entry points and pay at exit points.'
    ],
    constraints: [
      'Assume a maximum of 5 floors.',
      'Payment can be made via Cash or Credit Card.'
    ],
    hints: [
      'Think about using the Strategy pattern for pricing strategies.',
      'Consider the Singleton pattern for the ParkingLot manager class.'
    ],
    expectedConcepts: ['Encapsulation', 'Polymorphism', 'Singleton Pattern', 'Strategy Pattern']
  },
  {
    id: 'q-2',
    title: 'Library Management System',
    difficulty: 'Easy',
    category: 'Real World Systems',
    description: 'Design a system for managing books and members in a library.',
    requirements: [
      'Users can search for books by title, author, or subject.',
      'Members can borrow and return books.',
      'The system should calculate fines for overdue books.'
    ],
    constraints: [
      'A member can borrow a maximum of 5 books.',
      'Maximum checkout duration is 14 days.'
    ],
    hints: [
      'How will you handle a book having multiple copies?'
    ],
    expectedConcepts: ['Inheritance', 'State Pattern']
  },
  {
    id: 'q-3',
    title: 'Design Splitwise',
    difficulty: 'Hard',
    category: 'Financial Systems',
    description: 'Design an application like Splitwise to split expenses among friends.',
    requirements: [
      'Users can add expenses and split them equally, exactly, or by percentage.',
      'The system should show balances for each user.',
      'It should support simplifying debts.'
    ],
    constraints: [
      'Only one currency (USD) is supported for now.'
    ],
    hints: [
      'Consider representing debts as a directed graph.',
      'Think about the Factory pattern for creating different types of expense splits.'
    ],
    expectedConcepts: ['Graph Algorithms', 'Factory Pattern', 'Command Pattern']
  }
];

export const getQuestions = (): LLDQuestion[] => {
  return mockQuestions;
};

export const getQuestionById = (id: string): LLDQuestion | undefined => {
  return mockQuestions.find((q) => q.id === id);
};
