import React from 'react';

const HelpWanted: React.FC = () => (
  <div className="help-wanted container">
    <h2>Help Wanted</h2>
    <p>Things I could use help with:</p>
    <h4>Testing and feedback</h4>
    <p>
      If the site doesn't work well for you, the best thing would be to submit
      an issue on <a href="https://github.com/Joeboy/filmhose/issues">GitHub</a>
      .
    </p>
    <p>
      Regarding feature requests, I'm obviously limited to what information is
      easily available from the cinemas' websites. But feel free to submit
      feature requests in the same place.
    </p>
    <h4>Scrapers</h4>
    <p>
      The data underpinning the website comes from my{' '}
      <a href="https://github.com/Joeboy/cinescrapers">CineScrapers</a> project.
      The idea is to create{' '}
      <a href="https://en.wikipedia.org/wiki/Web_scraping">scrapers</a> for all
      the independent and arts cinemas in London. This is still at quite an
      early stage, with 17 sites covered so far and another 15 on the TO DO
      list. It doesn't seem <em>too</em> difficult or massively time-consuming,
      maybe it takes an hour per website (depending on the site). If anybody's
      up for helping out, please submit a pull request to the CineScrapers
      GitHub project.
    </p>
    <h4>Other Data Sources</h4>
    <p>
      Obviously if there are any more official sources available for any of
      these cinemas, it would be great to hear about that! I had a look for what
      APIs are available, but the things I found were expensive, limited or
      both. If you're mates with any of these cinemas, please ask if there's any
      way I could get their listings data more straightforwardly!
    </p>
    <h4>Sponsorship</h4>
    <p>
      You can sponsor me / filmhose / cinescrapers via{' '}
      <a href="https://github.com/sponsors/Joeboy">GitHub</a>, or{' '}
      <a href="https://www.paypal.com/paypalme/filmhose">paypal.me</a>.
    </p>

    <p>
      Also if anybody wants to do some more corporate sponsorship that gets your
      organization's name on the site, please get in touch with me.
    </p>
    <p>
      There's still a lot of scrapers to write, and they'll need to be
      maintained on an ongoing basis. There's a significant amount of work
      involved so it would be great to have some financial support to keep it
      going. Also, for $70 a month I think I could subscribe to the listings
      from the big cinema chains and make the listings more exhaustive.
    </p>

    <h4>Get in touch</h4>
    <p>
      If you want to get in touch about any of the above, you can reach me at{' '}
      <a href={'mailto:' + ['joe', 'filmhose.uk'].join('@')}>
        {'joe'}
        <span style={{ display: 'none' }}>-nospam-</span>
        {'@filmhose.uk'}
      </a>
      .
    </p>
  </div>
);

export default HelpWanted;
