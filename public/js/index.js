/* jshint jquery: true */

$(function() {

  'use strict';

  var IMG_W185 = 'http://image.tmdb.org/t/p/w185/';
  var IMG_ORIGIN = 'http://image.tmdb.org/t/p/original/';
  var season_data = '';
  var total_time = 0;

  function display_bg(bg_path){
    var bg_img = 'url(' + IMG_ORIGIN + bg_path +') no-repeat fixed ';
    $('body').css('background', bg_img).css('background-size','100% auto');

    // var bg_img = 'url(' + IMG_ORIGIN + bg_path +')';
    // $('body').css('background', bg_img).css('background-attachment','fixed').css('background-repeat','repeat').css('background-size','100% auto');
  }

  function display_selbox(seasons) {
    var i;
    var selbox = '<option value="all" selected="selected">전체시즌</option>';
    for (i = 0; i <seasons; i++) {
      selbox += '<option value="' + i + '">season ' + i + '</option>';
    }
    $('#select_season').empty();
    $('#select_season').append(selbox);
  }

  function calculator(total_run_time){
    var txt;
    var day;
    var hour;
    var minute;
    console.log('total_time: ' + total_time);
    console.log('total_run_time: ' + total_run_time);

    total_time = total_time + total_run_time;

    console.log('result:' + total_time);

    if (total_time >= 60) {
      hour = parseInt(total_time / 60);
      minute = total_time % 60;

      if (hour >= 24) {
        day = parseInt(hour/24);
        hour = hour % 24;
        txt = day + '일 ' + hour + '시간 ' + minute + '분'; 
      } else {
        txt = hour + '시간 ' + minute + '분';
      }

    } else {
      txt = total_time + '분';
    }

    $('.total_time').text(txt);
  }


  function append_tv(tv) {
    var title = '<h2>' + tv.name + '</h2>';
    var id = tv.id;
    var poster = '<img src="' + IMG_W185 + tv.poster_path + '">';
    var summary = '<p>' + tv.overview + '</p>';
    var score = '<p>평점 : ' + tv.vote_average + '</p>';
    $('.drama_list').append('<li data-id="' + id + '" class="drama_list_item">' +
                            title +
                            poster +
                            summary +
                            score +
                            '</li>');  
  }

  function append_tvs(tvs) {
    var i;
    for (i = 0; i < tvs.length; i++) {
      append_tv(tvs[i]);
    }
  }

  function append_season(season, run_time) {
    var id = season.id; 
    var episode_cnt =  season.episode_count;
    var total_run_time = episode_cnt * run_time;
    var poster = '<img src="' + IMG_W185 + season.poster_path + '">';
    var season_num = '<span> season' + season.season_number + '</span>';
    var delete_btn = '<input type="button" value="삭제" class="season_del">';
    $('.added_drama_list').append('<li data-id="' + id + '" data-run_time="' + total_run_time + '" class="drama_season_item">' + 
                                  poster + 
                                  season_num + 
                                  delete_btn);
    calculator(total_run_time);
  }

  function append_seasons(season) {
    
    // HACK
    var run_time = season_data.episode_run_time[0]; // minute
    
    if (season === 'all') {
      var i;
      var len;
      for (i = 0, len = season_data.seasons.length; i < len; i++) {
        append_season(season_data.seasons[i], run_time);
      }  
    } else {
      append_season(season_data.seasons[season], run_time);
    }
  }
  
  function search_tv(search_title) {
    $.ajax({
      url: '/search',
      method: 'GET',
      data: { search_title: search_title },
      dataType: 'json', // 응답 데이터 타입
      success: function(data) {
        append_tvs(data.results);
      }
    });
  }

  function search_tv_detail(id) {
    $.ajax({
      url: '/detail',
      method: 'GET',
      data: { id: id },
      dataType: 'json', // 응답 데이터 타입
      success: function(data) {
        season_data = data;
        display_bg(data.backdrop_path);
        display_selbox(data.number_of_seasons);
      }
    });
  }

  // search tv title
  $('#search_title').on('keydown', function() {
    var search_title = $('#search_title').val();
    $('.drama_list').empty();
    search_tv(search_title);
  });

  // search tv select
  $('.drama_list').on('click', '.drama_list_item', function() {
    var id = $(this).data('id');
    $('.drama_list').empty();
    search_tv_detail(id);
  });

  // season item add
  $('body').on('click', '#search', function() {
    var season = $('#select_season option:selected').val();
    append_seasons(season);
  });
 
  // season item delete
  $('.added_drama_list').on('click', '.season_del', function() {
    var run_time = $(this).parent().data('run_time');
    run_time *= -1;
    $(this).parent().remove();
    calculator(run_time);
  });


});
