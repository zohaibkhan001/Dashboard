import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { PostItemSkeleton } from './post-skeleton';
import { PostItemHorizontal } from './post-item-horizontal';

// ----------------------------------------------------------------------

export function PostListHorizontal({ posts, loading }) {
  const renderLoading = <PostItemSkeleton variant="horizontal" />;

  const renderList = posts.map((post) => <PostItemHorizontal key={post.blog_id} post={post} />);

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
      >
        {loading ? renderLoading : renderList}
      </Box>

      {posts.length > 8 && (
        //   <Pagination
        //   count={Math.ceil(posts.length / 8)} // Replace hardcoded count
        //   page={1} // or currentPage
        //   onChange={(e, value) => setCurrentPage(value)} // when implemented
        //   sx={{
        //     mt: { xs: 5, md: 8 },
        //     [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
        //   }}
        // />

        <Pagination
          count={8}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
