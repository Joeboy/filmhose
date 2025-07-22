import type { FC } from 'react';
import { Link } from 'react-router-dom';

const NotFound: FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <p>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'underline' }}>
          Go back to home
        </Link>
      </p>
    </div>
  );
};

export default NotFound;
