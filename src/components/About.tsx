import React from 'react';
import { usePageSEO } from '../hooks/usePageSEO';

const About: React.FC = () => {
  usePageSEO();

  return (
    <div className="about container">
      <h1>About FilmHose</h1>
      <p>
        I made Filmhose because I wanted a quick way to see what interesting
        films are showing on a particular day, without having to visit multiple
        websites. Initially I relied on my own scraping of listings data, but
        I've since updated the site to use data aggregated by{' '}
        <a href="https://clusterflick.com/">ClusterFlick</a>.
      </p>
      <p>Follow the socials on:</p>
      <ul>
        <li>
          Bluesky:{' '}
          <a
            href="https://bsky.app/profile/filmhose.bsky.social"
            target="_blank"
            rel="noopener noreferrer"
          >
            @filmhose.bsky.social
          </a>
        </li>
        <li>
          Twitter/X:{' '}
          <a
            href="https://x.com/FilmHose"
            target="_blank"
            rel="noopener noreferrer"
          >
            @FilmHose
          </a>
        </li>
      </ul>{' '}
      <p>&nbsp;</p>
      <h2>Trivia you probably don't care about:</h2>
      <ul>
        <li>
          I usually try to run the scrapers (ie. update the listings data) on
          Saturdays. But also, it only happens when I remember and have time.
        </li>
        <li>
          The "distilled" listings page works by omitting films that have more
          than ten upcoming screenings in the db. I figure that's a decent way
          to cut out the noise of all the blockbuster stuff.
        </li>
        <li>
          The site is coded with <a href="https://react.dev/">React</a>. I'm not
          a proper react developer and a lot of the code is LLM assisted.
        </li>
        <li>
          VSCode just tried to enter an item here about filmhose being a pun on
          "filmhouse", which it was never intended to be.
        </li>
        <li>
          it's actually a bit annoying that googling filmhose gives search
          results for filmhouse.
        </li>
        <li>
          Source code is available{' '}
          <a href="https://github.com/Joeboy/filmhose">here</a>.
        </li>
        <li>
          My total revenue from the site to date: £5.00. Thanks for the
          donation, John!
        </li>
      </ul>
    </div>
  );
};

export default About;
