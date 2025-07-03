import React from 'react';

const About: React.FC = () => (
  <div className="about container">
    <h2>About FilmHose</h2>
    <p>
      The origin story here is that I kept finding myself looking at multiple
      cinema websites to see if they were showing anything exciting. At some
      point I thought, "Wouldn't it be nice if there was a single place to see
      all the listings for London's independent and arts cinemas?" As far as I
      can see it doesn't exist.
    </p>
    <p>
      The obvious problem was collating all the data. London has a lot of
      cinemas, and they all publish their listings in different ways. So with
      that in mind I started the{' '}
      <a href="https://github.com/Joeboy/cinescrapers">CineScrapers</a> project.
      The idea there is to write{' '}
      <a href="https://en.wikipedia.org/wiki/Web_scraping">scrapers</a> that
      grab data from the individual cinema websites, and assemble it all in one
      place. This is still a work in progress. Right now I have scrapers for 14
      of the bigger indie cinemas, with another eighteen on the list. But that
      gets you a lot of film options already!
    </p>
    <p>
      FilmHose is a <a href="https://react.dev/">React</a> app that lets you
      browse the data. The source is available{' '}
      <a href="https://github.com/Joeboy/filmhose">here</a>.
    </p>
    <p>
      If any of this seems interesting, go <a href="/help">here</a> to see how
      you can help.
    </p>
  </div>
);

export default About;
