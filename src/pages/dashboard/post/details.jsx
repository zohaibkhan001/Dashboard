import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import { useGetPost } from 'src/actions/blog';

import { PostDetailsView } from 'src/sections/blog/view';
import { useEffect, useState } from 'react';
import api from 'src/utils/api';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

const metadata = { title: `Post details | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  const { title } = useParams(); // blog_id from route
  const id = title;
  const { token } = useSelector((state) => state.superAdminAuth);

  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postError, setPostError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setPostLoading(true);
      try {
        const response = await api.get(`/superAdmin/fetch_blog/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.success === 1) {
          setPost(response.data.data);
        } else {
          setPostError(response.data?.msg || 'Failed to fetch blog');
        }
      } catch (error) {
        setPostError(error.msg || 'Server error');
      } finally {
        setPostLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id, token]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PostDetailsView post={post} loading={postLoading} error={postError} />
    </>
  );
}
