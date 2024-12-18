import React from 'react';
import { Link } from 'react-router-dom';
import './styles/HomePage.css';

function HomePage() {
  return (
    <div className="HomePage">
<div class="site-wrapper">
  <div class="site-wrapper-inner">
    <div class="cover-container">

      <div class="masthead clearfix">
        <div class="inner">
          <h3 class="masthead-brand">Cover</h3>
          <nav>
            <ul class="nav masthead-nav">
              <li class="active"><a href="#">Home</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="inner cover">
        <h1 class="cover-heading">Cover your page.</h1>
        <p class="lead">Cover is a one-page template for building simple and beautiful home pages. Download, edit the text, and add your own fullscreen background photo to make it your own.</p>
        <p class="lead">
          <a href="#" class="btn btn-lg btn-default">Learn more</a>
        </p>
      </div>

      <div class="mastfoot">
        <div class="inner">
          <p>Cover template for <a href="http://getbootstrap.com">Bootstrap</a>, by <a href="https://twitter.com/mdo">@mdo</a>.</p>
        </div>
      </div>

    </div>
  </div>
</div>
    </div>
  );
}

export default HomePage;
