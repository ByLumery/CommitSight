import { GitHubService } from '../services/githubService';

// Mock do axios
jest.mock('axios');
const axios = require('axios');

describe('GitHubService', () => {
  let githubService: GitHubService;
  const mockToken = 'mock-token';

  beforeEach(() => {
    githubService = new GitHubService(mockToken);
    jest.clearAllMocks();
  });

  describe('getRepository', () => {
    it('deve buscar dados do repositório com sucesso', async () => {
      const mockRepoData = {
        id: 123,
        name: 'test-repo',
        full_name: 'owner/test-repo',
        description: 'Test repository',
        html_url: 'https://github.com/owner/test-repo',
        language: 'TypeScript',
        stargazers_count: 100,
        forks_count: 50,
        watchers_count: 200,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-12-01T00:00:00Z',
        owner: {
          login: 'owner',
          avatar_url: 'https://avatar.url'
        }
      };

      axios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockRepoData })
      });

      const result = await githubService.getRepository('owner', 'test-repo');

      expect(result).toEqual(mockRepoData);
    });

    it('deve lançar erro quando repositório não encontrado', async () => {
      axios.create.mockReturnValue({
        get: jest.fn().mockRejectedValue({ response: { status: 404 } })
      });

      await expect(githubService.getRepository('owner', 'nonexistent'))
        .rejects.toThrow('Repositório não encontrado');
    });
  });

  describe('getCommits', () => {
    it('deve buscar commits com sucesso', async () => {
      const mockCommits = [
        {
          sha: 'abc123',
          commit: {
            message: 'Test commit',
            author: {
              name: 'Test Author',
              email: 'test@example.com',
              date: '2023-01-01T00:00:00Z'
            }
          },
          author: {
            login: 'testauthor',
            avatar_url: 'https://avatar.url'
          },
          html_url: 'https://github.com/owner/repo/commit/abc123'
        }
      ];

      axios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockCommits })
      });

      const result = await githubService.getCommits('owner', 'repo');

      expect(result).toEqual(mockCommits);
    });
  });

  describe('getContributors', () => {
    it('deve buscar contribuidores com sucesso', async () => {
      const mockContributors = [
        {
          login: 'contributor1',
          id: 1,
          avatar_url: 'https://avatar.url',
          contributions: 50
        }
      ];

      axios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockContributors })
      });

      const result = await githubService.getContributors('owner', 'repo');

      expect(result).toEqual(mockContributors);
    });
  });
});
