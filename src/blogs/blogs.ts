import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';

const app = new Hono();

let blogPosts = [
  {
    id: '1',
    title: 'test',
    content: 'test',
  },
  {
    id: '2',
    title: 'test2',
    content: 'test2',
  },
  {
    id: '3',
    title: 'test3',
    content: 'test3',
  },
];

app.use('*', prettyJSON());

app.get('/', c => c.json({ posts: blogPosts }));

app.get('/posts/:id', c => {
  const id = c.req.param('id');
  const post = blogPosts.find(p => p.id === id);
  if (post) {
    return c.json(post);
  } else {
    return c.json({ message: 'not found' }, 404);
  }
});

app.post('/', async c => {
  const { title, content } = await c.req.json<{
    title: string;
    content: string;
  }>();
  const newPost = { id: String(blogPosts.length + 1), title, content };
  blogPosts = [...blogPosts, newPost];
  return c.json(newPost, 201);
});

app.put('/:id', async c => {
  const id = c.req.param('id');
  const index = blogPosts.findIndex(p => p.id === id);

  if (index === -1) {
    return c.json({ message: 'not found' }, 404);
  }

  const { title, content } = await c.req.json();
  blogPosts[index] = { ...blogPosts[index], title, content };

  return c.json(blogPosts[index]);
});

app.delete('/:id', async c => {
  const id = c.req.param('id');
  const index = blogPosts.findIndex(p => p.id === id);

  if (index === -1) {
    return c.json({ message: 'not found' }, 404);
  }

  blogPosts = blogPosts.filter(p => p.id !== id);

  return c.json({message:'deleted' , });
});

export default app;
