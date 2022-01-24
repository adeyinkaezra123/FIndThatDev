$(document).ready(function () {
  "use strict";
  //ALL ELEMENTS
  const search_input = $("#search");
  const search_btn = $("#search-btn");
  const name = $("#name");
  const nickname = $("#nickname");
  const date = $("#date");
  const avatar = $("#avatar");
  const toggle = $("#toggle");
  const description = $("#description");
  const repos_amount = $("#repos-amount");
  const followers_amount = $("#followers-amount");
  const following_amount = $("#following-amount");
  const city = $("#city");
  const blog = $("#blog");
  const twitter = $("#twitter");
  const work = $("#work");

  //Load the page with Octocat account loaded
  $.getJSON("https://api.github.com/users/octocat", function (result) {
    if (!result) {
      showError();
    } else {
      update_display(result);
    }
    //Load the page with preferred color scheme
    let matched = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (matched) {
      $("body").removeClass("light-theme");
    } else {
      $("body").addClass("light-theme");
    }
  });
  //Dark/light mode toggle function
  //Done through simple "dark mode " class to the body
  toggle.click(function (e) {
    $("body").toggleClass("light-theme");
  });
  //Get JSON from Github function
  function search_info(e) {
    let github_id = $.trim(search_input.val());
    const Url = `https://api.github.com/users/${github_id}`;
    if (e.type === "click" || e.which === 13) {
      if (!github_id) {
        showError();
      } else {
        $.getJSON(Url, function (result) {
          console.log(result);
          update_display(result);
        }).fail(function () {
          showError();
        });
      }
    }
  }

  //Get info from github on click and Enter button
  search_btn.click(search_info);
  $(document).on("keydown", search_info);

  //Refresh function
  function refresh() {
    //Empty all outputs and remove not-available styling, otherwise they stack-up
    $("#error").css("display", "none");
    nickname.text("");
    search_input.val("");
    name.text("");
    name.removeClass("not-available");
    description.text("");
    description.removeClass("not-available");
    city.text("");
    city.removeClass("not-available");
    date.text("");
    date.removeClass("not-available");
    repos_amount.text("");
    repos_amount.removeClass("not-available");
    followers_amount.text("");
    followers_amount.removeClass("not-available");
    following_amount.text("");
    following_amount.removeClass("not-available");
    work.text("");
    work.removeClass("not-available");
    twitter.text("");
    twitter.removeClass("not-available");
    blog.text("");
    blog.removeClass("not-available");
  }
  function toAppend(where, what, sms, login) {
    //If there is no data - show Not Available
    let av = "not-available";
    let appendix = sms || "Not Available";
    // Add @ sign to nickname
    if (where == nickname) {
      appendix = `@${what}`;
      // Format date to readable format
    } else if (where == date) {
      let d = new Date(what);
      appendix = `Joined ${d.toDateString().split(" ").slice(1).join(" ")}`;
      // If there is not Name show login
    } else if (where == name && what == null) {
      appendix = login;
      // Keep zero for numerical outputs
    } else if (what === 0) {
      appendix = 0;
      //Show normal data
    } else if (what) {
      appendix = what;
      av = "available";
    } else {
      //  Add styling of not available info
      where.addClass(`${av}`);
    }
    where.append(appendix);
  }

  //Create a different link based on passed flag
  function makeLink(str, flag) {
    //If there is no information - show "Not available"
    let link = `<a class="not-available">Not available</a>`;
    if (!str) {
      return link;
    } else if (flag === "twitter") {
      //Link on twitter page
      link = `<a href="https://twitter.com/${str}" target="_blank"> @${str}</a>`;
    } else if (flag === "blog") {
      //Link on website, don't show "https://"
      link = `<a href="${str}" target="_blank"> ${str.slice(8)} </a>`;
    } else if (flag === "company") {
      // Link on github page, remove "@" for the link
      if (str.slice(0, 1) === "@") {
        link = `<a href="https://github.com/${str.slice(
          1
        )} "target="_blank"> ${str} </a>`;
      } else {
        link = `<a href="https://github.com/${str} "target="_blank"> ${str} </a>`;
      }
    }
    return link;
  }

  //Show error function
  function showError() {
    $("#error").css("display", "block");
  }

  //Append function
  function update_display(data) {
    refresh();
    //Change avatar
    avatar.attr("src", data.avatar_url);
    toAppend(name, data.name, "Not Available", data.login);
    toAppend(nickname, data.login);
    toAppend(date, data.created_at);
    toAppend(description, data.bio, "This profile has no bio");
    toAppend(repos_amount, data.public_repos);
    toAppend(followers_amount, data.followers);
    toAppend(following_amount, data.following);
    toAppend(city, data.location);

    let blog_flag = "blog";
    let twitter_flag = "twitter";
    let company_flag = "company";
    let blog_link = makeLink(data.blog, blog_flag);
    let twitter_link = makeLink(data.twitter_username, twitter_flag);
    let work_link = makeLink(data.company, company_flag);

    twitter.html(twitter_link);
    blog.html(blog_link);
    work.html(work_link);
  }
});
