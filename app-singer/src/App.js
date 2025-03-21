import React, { useEffect } from 'react';
import { Route, Routes,  useLocation } from 'react-router';
import Layout  from './components/Layout';
import Home  from './components/Home';
import AdminGigs  from './components/AdminGigs';
import AdminBlogPosts  from './components/AdminBlogPosts';
import AdminVideos from './components/AdminVideos';
import Login  from './components/Login';
import GigList  from './components/GigList';
import NotFound  from './components/NotFound';
import Helmet  from 'react-helmet';

import ReactGA from 'react-ga';

// const PrivateRoute = ({ component: Component, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         isSignedIn() ? (
//           <Component {...props} />
//         ) : (
//           <Navigate to={{ pathname: '/', state: { from: props.location } }} />
//         )
//       }
//     />
//   );
// };

const App = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.initialize('UA-125473664-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, [location]);

  const renderHelmet = () => {
    const path = location.pathname;

    if (path === '/') {
      return (
        <Helmet>
          <meta charSet="utf-8" />
          <title>Amy Hawthorn | Soul RnB Session Singer Vocalist Songwriter Scotland</title>
          <link rel="canonical" href="http://www.amyhawthorn.com" />
          <meta
            name="description"
            content="Amy Hawthorn is a talented singer and songwriter with a special love of RnB, Soul, Funk and Blues. Check out Amy's latest news, tracks and engagements."
          />
        </Helmet>
      );
    } else if (path === '/giglist') {
      return (
        <Helmet>
          <meta charSet="utf-8" />
          <title>Amy Hawthorn | List of Live Gigs and Events</title>
          <link rel="canonical" href="http://www.amyhawthorn.com/giglist" />
          <meta
            name="description"
            content="Here you can find Amy Hawthorns's full list of gigs. Check her availability here."
          />
        </Helmet>
      );
    } else {
      return (
        <Helmet>
          <meta charSet="utf-8" />
          <title>Amy Hawthorn | Page Not Found</title>
          <meta name="description" content="Page not found or removed" />
          <meta name="robots" content="noindex,nofollow,noarchive" />
        </Helmet>
      );
    }
  };

  const path = location.pathname;
  const hide404 =
    path === '/' ||
    path === '/giglist' ||
    path === '/login' ||
    path === '/admin/gigs' ||
    path === '/admin/news' ||
    path === '/admin/videos';

  return (
    <div className="application">
      <Layout>
        {renderHelmet()}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/giglist" element={<GigList />} />
          {/* <Route exact path='/news' element={News} />
          <Route exact path='/news/:id' element={Post} /> */}
          <Route exact path="/admin/gigs" element={<AdminGigs />} />
          <Route exact path="/admin/news" element={<AdminBlogPosts />} />
          <Route exact path="/admin/videos" element={<AdminVideos />} />

          {!hide404 && <Route path="*" element={<NotFound />} status={404} />}
        </Routes>
      </Layout>
    </div>
  );
};

export default App;