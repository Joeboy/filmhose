import React from 'react';
import { usePageSEO } from '../hooks/usePageSEO';

const About: React.FC = () => {
  usePageSEO();

  return (
    <div className="about container">
      <h1>About FilmHose</h1>
      <p>
        Filmhose is a project to aggregate cinema listings for London's
        independent and arts cinemas. The origin story is that I kept finding
        myself looking at multiple cinema websites to see if they were showing
        anything exciting, and eventually decided to try creating a listings
        aggregator to scrape all the listings into a single publicly available
        source.
      </p>
      <p>
        It's a bit challenging because these cinemas all publish their listings
        in different ways, it's not as simple as just pulling in a feed from
        somewhere. The listings are mostly gathered using custom{' '}
        <a href="https://en.wikipedia.org/wiki/Web_scraping">scrapers</a>, which
        you can see <a href="https://github.com/Joeboy/cinescrapers">here</a> if
        you're interested.
      </p>
      <p>
        Unfortunately it's all a bit error-prone and often requires manual
        intervention. There's no income stream or business model here, it's just
        me in my spare time. Please have appropriate expectations! Honestly I'm
        not particularly careful about checking the data. If you see any issues,
        please let me know. And if you want to support the site financially
        *definitely* let me know. I'm open to sponsorship / advertising if it's
        appropriate and doesn't compromise the website.
      </p>
      <p>
        FilmHose is a <a href="https://react.dev/">React</a> app that lets you
        browse the data. The source is available{' '}
        <a href="https://github.com/Joeboy/filmhose">here</a>.
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
    </div>
  );
};

export default About;
