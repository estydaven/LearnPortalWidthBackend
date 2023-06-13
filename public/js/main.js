let loginWrap = document.querySelector('.wrapper_login');
let mainWrap = document.querySelector('.wrapper_main');

function showMainWrapper() {
	mainWrap.classList.remove('hide');
	loginWrap.classList.add('hide');
}
function showLoginWrapper() {
	mainWrap.classList.add('hide');
	loginWrap.classList.remove('hide');
}

let input = document.getElementById('password-input');
let passLink = document.querySelector('.password__control');

passLink.addEventListener('click', (event) => {
    if (input.getAttribute('type') == 'password') {
		event.target.classList.add('view');
		input.setAttribute('type', 'text');
	} else {
		event.target.classList.remove('view');
		input.setAttribute('type', 'password');
	}
	return false;
})

function onSubmit(form) {
  const formData = new FormData(form);
  const email = formData.get('email');
  const password = formData.get('password');
  const messageForm = document.querySelector('.login-form__message');

  $.post( '/api/users/login', { email, password })
  .done(function({user}) {
    showMainWrapper(); 
    form.reset();
    messageForm.classList.add('hide');
    setUser(user);
  })
  .fail(function(response) {    
    messageForm.classList.remove('hide');
    messageForm.innerHTML = !response.responseJSON ? 'Ошибка сервера' : response.responseJSON.message;
  })
}

$(function() {
  $.get('/api/users/session')
  .done(function({user}) {
    $('.preloader__inner, .preloader').fadeOut();
    
    if (user) {      
      mainWrap.classList.remove('hide');
      setUser(user);
    } else {
      loginWrap.classList.remove('hide');
    }
  })
});

function setUser(user) {
  $('.user__name').text(user.name);
  $('.cabinet-menu__name').text(user.name);
  $('.cabinet-menu__span').text(user.email);
  
  const tabs = user.available_pages;
  for (let i = 0; i < tabs.length; i++) {
    setShowedForTab(tabs[i]);
    setThemesProgress(tabs[i]);
  }

  const answers_right = user.answers_right;
  if (answers_right.length) {
    $('.quiz-preview__start').addClass('hide');
    $('.quiz-preview__finished_done').removeClass('hide');
  }

  const answers_false = user.answers_false;
  if (answers_false.length) {
    $('.quiz-preview__start').addClass('hide');
    $('.quiz-preview__finished_undone').removeClass('hide');
    $('.js-btn-next').prop('disabled', true);
  }

  const passed_videos = Array.from(new Set(user.passed_videos));
  galleryBtns = passed_videos;
  for (let i = 0; i < passed_videos.length; i++) {
    const videoBtns = $('.video__button');
    videoBtns.each(function() {
      const btn = $(this);      
      const id = $(this).attr('data-buttonid');

      if (passed_videos.includes(id)) {
        btn.addClass('video__button_passed');
        btn.text('Скрин отправлен!');
        btn.prop('disabled', true);
      }
    });
  }

  const percentVideo = (100 / videoBtns.length) * passed_videos.length;
  setVideosProgress(percentVideo);

  const tasks = user.available_tasks;
  for (let task of tasks) {
    setShowedForTask(task);
  }
  
  const passed_tasks = user.passed_tasks.length;
  setTasksProgress(passed_tasks);
}

function logout() {
  $.ajax({
    url: '/api/users/session',
    type: 'DELETE',
    success: function() {
      showLoginWrapper();
    },
  });
}

// Tabs menu

$('ul.menu button').each(function() {
  $(this).click(function (e) {
    hidePrivatCabinet();
    hideTaskContent();
    const li = $(this).parent();
    
    if (!(li.hasClass("showed"))) {
      $('.popup_access').css('display', 'flex');
    } else {
      e.stopPropagation();
      const tab = li.attr('data-tab');
      
      li.siblings().removeClass('open');
      li.siblings().each(function() {
        $(this).find('li').removeClass('open');
      });

      //const openDataTab = li.attr('data-open');
      if (!tab) {
        li.toggleClass('open');
      } else {
        $('ul.menu li.active').removeClass('active');
        $('ul.tab-content li.active').removeClass('active');
        saveActiveTab(tab);
        openTab(tab); 
      }
    }
    
    if ($(this).hasClass("submenu__button_test")) {
      $('.tab-buttons').css('display', 'none');
      $('.tab-content').css('height', '100%');
    } else {
      $('.tab-buttons').css('display', 'flex');
      $('.tab-content').css('height', 'calc(100% - 87px)');
    }
  });
});

// Local Storage

function saveActiveTab(tabId) {
  window.localStorage.setItem('active-tab', tabId);
}

function loadActiveTab() {
  const activeTab = localStorage.getItem('active-tab') || '1.1';
  openTab(activeTab);
  
  const indices = activeTab.split('.');
  let ul = $('ul.menu');

  for (const index of indices) {
    const li = $(ul.children()[index - 1]);
    li.addClass('open');    

    ul = li.children('ul').first();
    ul.addClass('open');
  }
}
function openTab(tabId) {
  const nextTab = getNextTab(tabId);
  $('.js-btn-next').prop('disabled', !nextTab);

  const prevTab = getPrevTab(tabId);
  $('.js-btn-prev').prop('disabled', !prevTab);

  $(`ul.menu li[data-tab="${tabId}"]`).first().addClass('active');
  $(`ul.tab-content li[data-tab="${tabId}"]`).first().addClass('active');
}

$('ul.menu li[data-tab]').each(function() {
  $(this).click(function () {
    saveActiveTab($(this).attr('data-tab'));
  });
});

$(document).ready(() => {
  loadActiveTab();
});

// Prev/Next Buttons
const themesOneCount = [];
const themesTwoCount = [];
const themesOne = [];
const themesTwo = [];

$('ul.menu li[data-tab]').each(function() { 
  const id = $(this).attr('data-tab');
  if (id.includes('1.')) {
    themesOne.push(id);
  }
  if (id.includes('2.')) {
    themesTwo.push(id);
  }
});

function setThemesProgress(activeTab) {
  if (activeTab.includes('1.')) {
    themesOneCount.push(activeTab);
  }
  if (activeTab.includes('2.')) {
    themesTwoCount.push(activeTab);
  }

  const percentFistTheme = 100 / themesOne.length * themesOneCount.length;
  const percentSecondTheme = 100 / themesTwo.length * themesTwoCount.length;

  if (+percentFistTheme <= 100) {
    $('.percent_one').html(`${percentFistTheme.toFixed()}`);
  } else {
    $('.percent_one').html('100');
  }

  if (+percentSecondTheme <= 100) {
    $('.percent_two').html(`${percentSecondTheme.toFixed()}`);
  } else {
    $('.percent_two').html('100');
  }
  
  $('.stat-line_one').css('width', `${percentFistTheme.toFixed()}%`);    
  $('.stat-line_two').css('width', `${percentSecondTheme.toFixed()}%`);

  if (percentFistTheme > 20 && percentFistTheme < 70) {
    $('.stat-block__percent_one').css('color', '#0EC1FF');      
  } else if (percentFistTheme > 70) {
    $('.stat-block__percent_one').css('color', '#E04AA8');
  } 
  
  if (percentSecondTheme > 20 && percentSecondTheme < 70) {
    $('.stat-block__percent_two').css('color', '#0EC1FF');      
  } else if (percentSecondTheme > 70) {
    $('.stat-block__percent_two').css('color', '#E04AA8');
  }
  
  if (percentFistTheme == 100) {
    $('.themes-count').html('1');
  }
  if (percentSecondTheme == 100) {
    $('.themes-count').html('2');
  }
}

$(document).ready(() => {
  $('.js-btn-next').click(function () {
    const activeTab = localStorage.getItem('active-tab') || '1.1';
    const nextTab = getNextTab(activeTab);
    hidePrivatCabinet();    

    if (nextTab) {      
      setShowedForTab(nextTab);
      addAvailablePage(nextTab);

      $('ul.menu li.active').removeClass('active');
      $('ul.menu li.open').removeClass('open');
      $('ul.tab-content li.active').removeClass('active');
      saveActiveTab(nextTab);
      loadActiveTab();
    }
    setThemesProgress(activeTab);

    $('.tab-content__item_test.active').each(function() {
      $('.tab-buttons').css('display', 'none');
      $('.tab-content').css('height', '100%');
    });
  });
  $('.js-btn-prev').click(function () {
    const activeTab = localStorage.getItem('active-tab') || '1.1';    
    const prevTab = getPrevTab(activeTab);
    hidePrivatCabinet();
    hideTaskContent();

    if (prevTab) {
      $('ul.menu li.active').removeClass('active');
      $('ul.menu li.open').removeClass('open');
      $('ul.tab-content li.active').removeClass('active');
      saveActiveTab(prevTab);
      loadActiveTab();
    }
  });
});

function setShowedForTab(tab) {
    let li = $(`ul.menu li[data-tab="${tab}"]`);

    while (li.is('li')) {
      li.addClass('showed');
      li = li.parent().parent();
    }
}

function addAvailablePage(nextTab) {
  $.ajax({
    url: 'api/users',
    type: 'PUT',
    data: {nextTab}
  });
}

function addAvailableTask(task) {
  $.ajax({
    url: 'api/users/available-tasks',
    type: 'PUT',
    data: {task}
  });
}

function getNextTab(activeTab) {
  let li = $(`ul.menu li[data-tab="${activeTab}"]`);

  while (li.is('li')) {
    li = li.next();

    if (li.length) {
      let tab = li.attr('data-tab');

      while (!tab) {
        li = li.children('ul').first().children().first();
        tab = li.attr('data-tab');
      }
      return tab;
    } else {
      li = li.prevObject.parent().parent();
    }
  }
}

function getPrevTab(activeTab) {
  let li = $(`ul.menu li[data-tab="${activeTab}"]`);  
  
  while (li.is('li')) {
    li = li.prev();
    // let openDataTab = li.attr('data-open');
    // if (openDataTab) {
    //   li = li.children('ul').first().children().last();
    // }
    
    if (li.length) {
      let tab = li.attr('data-tab');
      
      while (!tab) {
        li = li.children('ul').first().children().last();
        tab = li.attr('data-tab');
      }
      return tab;
    } else {
      li = li.prevObject.parent().parent();
    }
  }
}

$(document).ready(() => {
  window.addEventListener('storage', function(event){
    if (event.storageArea === 'localStorage') {
        console.log(event);
    }
  }, false);
});

// Search

$('.search__icon').on('click', function () {
  $('.search').toggleClass('open');
  $('.search__field').toggleClass('hide');
});

// Personal Cabinet
$('.user').on('click', function () {
  const activeTab = localStorage.getItem('active-tab') || '1.1';
  const li = $(`ul.tab-content li[data-tab="${activeTab}"]`);
  $('.private-cabinet').removeClass('hide');
  $('.cabinet-menu').removeClass('hide');
  li.removeClass('active');
});

function hidePrivatCabinet() {
  const activeTab = localStorage.getItem('active-tab') || '1.1';
  const li = $(`ul.tab-content li[data-tab="${activeTab}"]`);
  $('.private-cabinet').addClass('hide');
  $('.cabinet-menu').addClass('hide');

  $('.private-cabinet').addClass('hide');
  $('.cabinet-menu').addClass('hide');
  li.addClass('active');
}

// Tasks script

$('.task-header').click(function () {
  let id = $(this).attr('data-task'),
    content = $('.task-content[data-task="' + id + '"]');
  const task = $(this);
  
  if (task.hasClass("showed")) {
    $('.task-header').addClass('hide');
    $('.task-content.active').removeClass('active');
    content.addClass('active');    
  } else {
    $('.popup_access').css('display', 'flex');
    $('.popup_access .popup__title').html('Сделайте предыдущую задачу, чтобы получить доступ к следующей');
  }
});

$('.task-return').click(function () {
  hideTaskContent();
});

function hideTaskContent() {
  $('.task-header').removeClass('hide');
  $('.task-content.active').removeClass('active');
}

function setShowedForTask(task) {
  let li = $(`ul.tasks__headers li[data-task="${task}"]`);
  li.addClass('showed');
}

function setShowedForNextTask() {
  const taskId = $('.task-header.showed').next().attr('data-task');
  $('.task-header.showed').next().addClass('showed');
  addAvailableTask(taskId);
}

const fileElemTask = document.querySelector("#fileElem2");
const fileElemVideos = document.querySelector("#fileElem");
fileElemTask.addEventListener('change', previewFiles);
fileElemVideos.addEventListener('change', previewFiles);
const convertTasksImagesResults = [];
const convertVodeosImagesResults = [];
function previewFiles() {
  const filesTask = document.querySelector("#fileElem2").files;
  const filesVideos = document.querySelector("#fileElem").files;
  const fileId = this.dataset.screen;

  function readAndPreview(file) {

    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
      const reader = new FileReader();
      
      reader.addEventListener(
        "load",
        () => {
          const image = new Image();
          image.height = 100;
          image.title = file.name;
          image.src = reader.result;
          if (fileId == 2) {
            convertTasksImagesResults.push(reader.result);
          }
          if (fileId == 1) {
            convertVodeosImagesResults.push(reader.result);
          }
        },
        false
      );

      reader.readAsDataURL(file)
    }
  }

  if (filesTask) {
    Array.prototype.forEach.call(filesTask, readAndPreview);
  }
  if (filesVideos) {
    Array.prototype.forEach.call(filesVideos, readAndPreview);
  }
}


function onSubmitTask(formTask) {
  const formData = new FormData(formTask);
  const taskScreens = convertTasksImagesResults;
  const taskLink = formData.get('link');
  const taskComment = formData.get('comment');
  const taskId = $(formTask).attr('data-formId');

  $.ajax({
    url: `/api/tasks/${taskId}/results`,
    type: 'PUT',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ taskLink: taskLink, taskComment: taskComment, taskScreens: taskScreens}),
    success: function() {
      formTask.reset();
      showConfirmPopup();
      resetPopupShot();
      closepopupShot();
      setShowedForTask();
      setShowedForNextTask();
      setTasksProgress(taskId);
    }
  });

  $.ajax({
    url: `/api/users/passed_tasks`,
    type: 'PUT',
    data: {taskId}
  });
}

function setTasksProgress(taskId) {
  if (taskId == 1) {
    $('.percent_four').html('50');
    $('.stat-block__percent_four').css('color', '#0EC1FF');
    $('.stat-line_four').css('width', '50%');
  } else if (taskId == 2) {
    $('.themes-count').text('4');
    $('.percent_four').html('100');
    $('.stat-block__percent_four').css('color', '#E04AA8');
    $('.stat-line_four').css('width', '100%');
  }
}

function showConfirmPopup() {
  $('.popup_confirm').css('display', 'flex');
}

function closeConfirmPopup() {
  $('.popup_confirm').css('display', 'none');
}

$('.popup__close_confirm').click(function() {
  closeConfirmPopup();
});

// Popup shot and task

const body = document.body;

$('.video__button').each(function() {
  $(this).click(function () {
    showPopupShot();
    $('.file-form_video').css('display', 'flex');
    $('.file-form_task').css('display', 'none');
    const btn = $(this);
    const btnData = $(this).attr('data-buttonid');
    $('.gallery-files__button').attr('data-sendData', btnData);

    $('.gallery-files__button').click(function() {
      const btnSendData = $(this).attr('data-sendData');
      const videoScreens = convertVodeosImagesResults;

      $.ajax({
        url: `/api/screens/${btnSendData}/video_screens`,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ videoScreens: videoScreens})
      });
      
      $.ajax({
        url: `/api/users/passed_videos`,
        type: 'PUT',
        data: {btnSendData},
        success: function() {
          btn.addClass('video__button_passed');
          btn.text('Скрин отправлен!');
          btn.prop('disabled', true);
        }
      });    
    });
  });
});

function showPopupShot() {
  $('.popup_shot').css('display', 'flex');
  $('body').css('overflow', 'hidden');  
}

function resetPopupShot() {
  $('.gallery-files__block').remove();
  $('.drop-area').removeClass('open');
  $('.gallery-files__button_video').css('display', 'none');
  $('.popup__wrapper').removeClass('popup-task');
  $('.popup__wrapper').removeClass('popup__wrapper_task');
  $('.gallery-files__btn_task').removeClass('hide');
  $('.gallery-files__btn_video').removeClass('hide');
  $('.file-form__buttons').removeClass('hide');
  $('.file-form__title').html('Вставь комментарий и скриншоты о выполнении задачи №1');
  $('.file-form__textarea').val('');
  $('.file-form__content_task').removeClass('file-form__content_mrg');
  $('.file-form__content_task').addClass('hide');
  $('.file-form__content_video').removeClass('hide');
  $('.gallery-files__btn_send').addClass('hide'); 
  $('.gallery-files__button_task').css('display', 'none');
}

function closepopupShot() {
  $('.popup_shot').css('display', 'none');
  $('body').css('overflow', 'auto');
}

function closePopupAccess() {
  $('.popup_access').css('display', 'none');
  $('body').css('overflow', 'auto');
}

function showScreensTask() {
  $('.file-form__comment').addClass('hide');
  $('.file-form__content_task').removeClass('hide');
  $('.popup__wrapper').removeClass('popup__wrapper_task');
  $('.gallery-files__button').attr('data-sendData', 6);
}

function showCommentTaskContent() {
  $('.file-form__comment').removeClass('hide');
  $('.file-form__content_task').addClass('hide');
  $('.file-form__buttons').addClass('hide');
  
  let galleryBlocks = $('.gallery-files__block');
  for (let i = 0; i < galleryBlocks.length; i++) {
    if (galleryBlocks.length > 1) {
      $('.file-form__content_task').addClass('hide');
    } else {
      $('.file-form__content_task').removeClass('hide');
    }
  }
  $('.file-form__content_task').addClass('file-form__content_mrg');
  $('.file-form__title').html('Комментарий и скриншоты');
  $('.gallery-files__btn_task').addClass('hide');
  $('.gallery-files__btn_send').removeClass('hide');
}

function showTaskContent() {
  $('.file-form_task').css('display', 'flex');
  $('.file-form_video').css('display', 'none');
  $('.file-form__content_video').addClass('hide');
  $('.popup__wrapper').addClass('popup__wrapper_task');
  $('.popup__wrapper').addClass('popup-task');
  $('.file-form__comment').removeClass('hide');
}

$('.popup__close_shot').click(function() {
  resetPopupShot();
  closepopupShot();
});

$('.popup__close_access').click(function() {
  closePopupAccess();
});

let galleryBtns = [];
const videoBtns = $('.video__button'); 

$('.gallery-files__button_video').click(function() {
  resetPopupShot();
  closepopupShot();
  
  galleryBtns.push($('.gallery-files__button_video').attr('data-senddata'));  
  const percentVideo = 100 / videoBtns.length * galleryBtns.length;
  setVideosProgress(percentVideo);
});

function setVideosProgress(percentVideo) {
  $('.percent_three').html(`${percentVideo.toFixed()}`);
  $('.stat-line_three').css('width', `${percentVideo.toFixed()}%`);

  if (percentVideo > 20 && percentVideo < 70) {
    $('.stat-block__percent_three').css('color', '#0EC1FF');      
  } 
  if (percentVideo > 70) {
    $('.stat-block__percent_three').css('color', '#E04AA8');
  } 
  if (percentVideo == 100) {
    $('.themes-count').html('3');     
  }
}

$('.task-screen').click(function() {
  showPopupShot();
  showTaskContent();
});

$('.add-screenshots').click(function() {
  showScreensTask();
});

$('.gallery-files__button_task').click(function() {
  showCommentTaskContent();
});

// ************************ Drag and drop ***************** //
let dropArea = document.querySelector(".drop-area");
const buttonVideo = document.querySelector('.gallery-files__btn_video');
const buttonTask = document.querySelector('.gallery-files__btn_task');
const galleryButton = document.querySelector('.gallery-files__button_video');
const buttonTaskSend = document.querySelector('.gallery-files__button_task');
const fileContent = document.querySelectorAll('.file-form__content');
const fileContentTask = document.querySelector('.file-form__content_task');
const buttonSend = document.querySelector('.gallery-files__btn_send');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
})

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  dropArea.classList.add('highlight');
}

function unhighlight(e) {
  dropArea.classList.remove('highlight');
}

function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;
  handleFiles(files);
}

function handleFiles(files) {
  files = [...files];
  //uploadFiles(files);
  files.forEach(previewFile);
}

function previewFile(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    if (dropArea.classList.contains('popup-task')) {
      if(!(buttonSend.classList.contains('hide'))) {
        buttonTaskSend.style.display = 'none';
      } else {
        buttonTaskSend.style.display = 'block';
      }      
    } else {
      galleryButton.style.display = 'block';
    }

    dropArea.classList.add('open');

    let divImage = document.createElement('div');
    divImage.className = 'gallery-files__block';
    let imageTrash = document.createElement('div');
    imageTrash.className = 'gallery-files__trash';
    let img = document.createElement('img');
    img.className = 'gallery-files__image';
    img.src = reader.result;

    if (dropArea.classList.contains('popup-task')) {
      const gallery = document.querySelector('.gallery-files_task');
      gallery.appendChild(divImage).appendChild(img);
    } else {
      const gallery = document.querySelector('.gallery-files_video');
      gallery.appendChild(divImage).appendChild(img);
    }
    
    divImage.appendChild(imageTrash);

    let galleryBlocks = document.querySelectorAll('.gallery-files__block');
    
    for (let i = 0; i < galleryBlocks.length; i++) {
      if (galleryBlocks.length > 1) {
        // fileContent.forEach(el => el.addEventListener('click', function () {
        //   fileContent.classList.add('hide');    
        // }));
        $('.file-form__content_task').addClass('hide');
        $('.file-form__content_video').addClass('hide');
      }       
    }
    galleryBlocks.forEach(el => el.addEventListener('click', function () {
      this.remove();
      $('.file-form__content_task').removeClass('hide');
      $('.file-form__content_video').removeClass('hide');
      //fileContent.classList.remove('hide');      
    }));
  }
}

// Timer

let time = 1800;
let intr;

function start_timer() {
  intr = setInterval(tick, 1000);
}

function tick() {
  time = time - 1;
  let mins = Math.floor(time / 60);
  let secs = time - mins * 60;
  if (mins == 0 && secs == 0) {
    $('.popup_time').css('display', 'flex');
    clearInterval(intr);
  }
  secs = secs >= 10 ? secs : "0" + secs;
  $(".timer__time").html(mins + ':' + secs);
}

// Quiz

const quizButton = document.querySelectorAll('.quiz-submit');
const quizResultCorrect = document.querySelectorAll('.quiz-result_correct');
const quizResultInorrect = document.querySelectorAll('.quiz-result_incorrect');
const quizResultFail = document.querySelector('.quiz-result_fail');
const timerTime = document.querySelector('.timer__time');
const quizButtonIncorrect = document.querySelectorAll('.quiz-button_incorrect');
const quizButtonStart = document.querySelectorAll('.quiz-preview__button');
const articleWrapper = document.querySelectorAll('.article__wrap');
const quizTextCorrect = document.querySelector('.quiz-text_correct');
const quizTextFail = document.querySelector('.quiz-text_fail');
const qiuzPreviewWrapper = document.querySelectorAll('.quiz-preview');
const questionsQuantity = document.querySelectorAll('.quiz-questions');
const questions = document.querySelectorAll('.quiz-block');
const erorMessage = document.querySelector('.popup__title_test');
const answers = document.querySelectorAll('.answer__input');
let score = 0;
let trying = 0;

function startQuiz() {
  start_timer();
  articleWrapper.forEach(el => el.style.display = 'flex');
  qiuzPreviewWrapper.forEach(el => el.classList.add('hide'));
}

function restartQuiz() {
  $('.popup_time').css('display', 'none');
  answers.forEach(el => el.checked = false);
  time = 1800;
  clearInterval(intr);
  start_timer();
  quizButton.forEach(el => el.classList.remove('hide'));
  quizResultInorrect.forEach(el => el.classList.add('hide'));
  quizResultCorrect.forEach(el => el.classList.add('hide'));
  trying++;
  console.log(trying);
  
  if (trying == 3) {
    quizButton.forEach(el => el.classList.add('hide'));
    quizResultFail.classList.remove('hide');
    time = 1800;
    clearInterval(intr);

    const answer = document.querySelector('.quiz-text_correct').innerHTML;

    $.ajax({
      url: `/api/users/test_undone`,
      type: 'PUT',
      data: {answer},
      success: function() {
        $('.js-btn-next').prop('disabled', true);
      }
    });
  }
}

quizButtonStart.forEach(el => el.addEventListener('click', function () {
  startQuiz();
}));
quizButtonIncorrect.forEach(el => el.addEventListener('click', function () {
  restartQuiz();
}));

function showTestErrorPopup() {
  $('.popup_test').css('display', 'flex');
}

function closeTestErrorPopup() {
  $('.popup_test').css('display', 'none');
}

$('.popup__close_test').click(function() {
  closeTestErrorPopup();
});

const answerCheckedFirst = {};
const answerCheckedSecond = {};
$('.answer__input').each(function() {
  $(this).click(function () { 
    const test = $(this).parent().parent().parent().attr('data-test');
    const key = +$(this).parent().parent().attr('data-question');
    const value = +$(this).val();   
    if ($(this).prop('checked')) {
      if (test == 1) {
        if (!answerCheckedFirst[key]) { // тут мы смотрим, нет ли значения ключа
          answerCheckedFirst[key] = [value]; // если значения нет, то добавляем его в объект (пару ключ значение)
        } else { // в случае если у юзера уже отмечен ответ, и он решил его поменять
          if ($(this).hasClass('answer__input_radio')) { // если у ключа уже есть значение
            answerCheckedFirst[key] = [value];
          }        
          if ($(this).hasClass('answer__input_checkbox') && answerCheckedFirst[key].includes(value)) { // если у ключа уже есть значение
            answerCheckedFirst[key] = answerCheckedFirst[key].filter((n) => n !== value); // исключаем значение
          } 
          if ($(this).hasClass('answer__input_checkbox')) { // если у ключа значения нету
            answerCheckedFirst[key].push(value); //добавляем значение
          }
        }
      } if (test == 2) {
        if (!answerCheckedSecond[key]) { // тут мы смотрим, нет ли значения ключа
          answerCheckedSecond[key] = [value]; // если значения нет, то добавляем его в объект (пару ключ значение)
        } else { // в случае если у юзера уже отмечен ответ, и он решил его поменять
          if ($(this).hasClass('answer__input_radio')) { // если у ключа уже есть значение
            answerCheckedSecond[key] = [value];
          }        
          if ($(this).hasClass('answer__input_checkbox') && answerCheckedSecond[key].includes(value)) { // если у ключа уже есть значение
            answerCheckedSecond[key] = answerCheckedSecond[key].filter((n) => n !== value); // исключаем значение
          } 
          if ($(this).hasClass('answer__input_checkbox')) { // если у ключа значения нету
            answerCheckedSecond[key].push(value); //добавляем значение
          }
        }
      }
    }
    if (!($(this).prop('checked'))) {
      if (test == 1) {
        answerCheckedFirst[key] = answerCheckedFirst[key].filter((n) => n !== value);
      }
      if (test == 2) {
        answerCheckedSecond[key] = answerCheckedSecond[key].filter((n) => n !== value);
      }
    }
  });
});

function sendAnswersRocket() {
  questionsQuantity.forEach(el => el.innerText = questions.length);  

  $.ajax({
    url: `/api/tests`,
    type: 'PUT',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ answers: answerCheckedSecond}),
    success: function(response) {
      const trueAnswers = response.trueAnswers.length;
      quizResultCorrect.forEach(el => el.classList.remove('hide'));
      quizButton.forEach(el => el.classList.add('hide'));
      quizTextCorrect.innerText = trueAnswers;
      time = 1800;
      clearInterval(intr);
      timerTime.innerText = '30:00';
    },
    error: function(response) {
      if (response.responseJSON.falseAnswers) {
        quizResultInorrect.forEach(el => el.classList.remove('hide'));
        quizButton.forEach(el => el.classList.add('hide'));
        time = 1800;
        clearInterval(intr);
        timerTime.innerText = '30:00';
        const answer = questions.length - response.responseJSON.falseAnswers.length;
        quizTextFail.innerText = answer;
      } else {
        showTestErrorPopup();
        erorMessage.innerText = response.responseJSON.message;
      }
    }
  });
}

$('.quiz-button_correct').click(function() {  
  const answer = document.querySelector('.quiz-text_correct').innerHTML;
  
  $.ajax({
    url: `/api/users/test_done`,
    type: 'PUT',
    data: {answer},
    success: function() {}
  });
});