import React from 'react';

export function JsonLd() {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ArchMind',
      alternateName: [
        'ArchMind AI',
        'ArchMind System Design',
        'ArchMind by Varnikumar Patel',
        'ArchMind HLD LLD Practice Platform',
      ],
      url: 'https://archmind.codewithvarni.app',
      description:
        'ArchMind is the AI Copilot for System Design, High-Level Design (HLD) Practice, and Low-Level Design (LLD) Practice by Varnikumar Patel.',
      author: {
        '@type': 'Person',
        name: 'Varnikumar Patel',
        url: 'https://www.linkedin.com/in/varnikumarpatel',
        sameAs: [
          'https://github.com/Varni1512',
          'https://www.linkedin.com/in/varnikumarpatel',
        ],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'ArchMind — AI System Design Copilot',
      operatingSystem: 'All',
      applicationCategory: 'DeveloperApplication',
      url: 'https://archmind.codewithvarni.app',
      description:
        'AI-powered system design copilot for HLD practice, LLD practice, machine coding, UML class diagrams, and interactive mock interviews.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '150',
      },
      author: {
        '@type': 'Person',
        name: 'Varnikumar Patel',
        url: 'https://www.linkedin.com/in/varnikumarpatel',
      },
      featureList: [
        'HLD Practice - High-Level Design Architecture Builder & Review',
        'LLD Practice - Low-Level Design UML Class Diagrams & Machine Coding',
        'System Design Practice & Interactive Mock Interviews',
        'Traffic & Failure Simulations with SPOF Detection',
        'AI Architecture Generator from Natural Language',
        'Terraform & Infrastructure as Code Generation',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ArchMind',
      url: 'https://archmind.codewithvarni.app',
      logo: 'https://archmind.codewithvarni.app/favicon/web-app-manifest-512x512.png',
      founder: {
        '@type': 'Person',
        name: 'Varnikumar Patel',
        url: 'https://www.linkedin.com/in/varnikumarpatel',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is ArchMind and who created it?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'ArchMind is an AI-powered system design copilot created by Varnikumar Patel. It helps software engineers master High-Level Design (HLD) and Low-Level Design (LLD) practice, prepare for system design interviews, and simulate real-world scalable architectures.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I practice HLD (High-Level Design) on ArchMind?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'On ArchMind, you can practice HLD by using the interactive architecture canvas, generating architectures with AI, running live traffic and failure simulations, detecting Single Points of Failure (SPOFs), and getting comprehensive AI design reviews.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I practice LLD (Low-Level Design) and Machine Coding on ArchMind?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'ArchMind provides a dedicated LLD practice workspace where you can build UML class diagrams, analyze SOLID principles, get design pattern recommendations, and auto-generate production-ready boilerplate code.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is ArchMind effective for System Design Interview practice?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! ArchMind includes an AI Design Mentor that acts as an adaptive interviewer. It guides requirement gathering, asks deep follow-up questions based on your architectural choices, and provides structured feedback reports.',
          },
        },
      ],
    },
  ];

  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
