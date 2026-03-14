export const MOCK_JOBS = [
  {
    id: '1',
    title: 'Senior Machine Learning Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are looking for an experienced ML Engineer to help build our next-generation AI models for recruitment.',
    requirements: ['5+ years Python', 'PyTorch/TensorFlow', 'LLM experience preferred'],
    postedAt: '2 days ago',
  },
  {
    id: '2',
    title: 'Frontend Developer (React)',
    department: 'Engineering',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Join our core product team to build beautiful, responsive, and animated user interfaces.',
    requirements: ['3+ years React', 'Modern CSS/Animations', 'Performance Optimization'],
    postedAt: '1 week ago',
  },
  {
    id: '3',
    title: 'Product Designer',
    department: 'Design',
    location: 'London, UK / Remote',
    type: 'Contract',
    description: 'Shape the future of AI recruitment through intuitive and stunning user experiences.',
    requirements: ['Figma expert', 'Prototyping', 'Design Systems'],
    postedAt: '3 days ago',
  }
];

export const MOCK_APPLICATIONS = [
  {
    id: 'a1',
    jobId: '1',
    candidateName: 'Alice Chen',
    email: 'alice@example.com',
    appliedAt: '2026-03-12T10:00:00Z',
    status: 'pending', // pending, reviewed
    aiScore: null,
    aiAnalysis: null
  },
  {
    id: 'a2',
    jobId: '2',
    candidateName: 'Bob Smith',
    email: 'bob.smith@example.com',
    appliedAt: '2026-03-13T14:30:00Z',
    status: 'reviewed',
    aiScore: 85,
    aiAnalysis: {
      summary: 'Strong frontend skills with solid React experience. Good match for the role.',
      pros: ['Extensive React experience', 'Understands modern CSS'],
      cons: ['Lacks mention of performance optimization tools'],
      keywordsMatched: ['React', 'CSS', 'JavaScript', 'Frontend']
    }
  }
];
