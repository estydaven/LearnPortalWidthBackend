/* eslint no-undef: "off" */
/* eslint no-unused-vars: "off" */

// Hide/Show Password
const input = document.getElementById('password-input');
const passLink = document.querySelector('.password__control');

passLink.addEventListener('click', (event) => {
  if (input.getAttribute('type') === 'password') {
    event.target.classList.add('view');
    input.setAttribute('type', 'text');
  } else {
    event.target.classList.remove('view');
    input.setAttribute('type', 'password');
  }
  return false;
});

// Scroll to top
// $(document).ready(function () {
//   $(function () {
//     $('.tab-button_next, .quiz-button_incorrect-theory, .quiz-button_incorrect-rocket').click(function () {
//       $('body,html').animate({
//         scrollTop: 0,
//       }, 800);
//       return false;
//     });
//   });
// });

// Login User
const loginWrap = document.querySelector('.wrapper_login');
const mainWrap = document.querySelector('.wrapper_main');

function showMainWrapper() {
  mainWrap.classList.remove('hide');
  loginWrap.classList.add('hide');
}
function showLoginWrapper() {
  mainWrap.classList.add('hide');
  loginWrap.classList.remove('hide');
}

function onSubmit(form) {
  const formData = new FormData(form);
  const email = formData.get('email');
  const password = formData.get('password');
  const messageForm = document.querySelector('.login-form__message');

  $.post('/api/users/login', { email, password })
    .done(function (response) {
      showMainWrapper();
      form.reset();
      messageForm.classList.add('hide');
      initApp(response);
    })
    .fail(function (response) {
      messageForm.classList.remove('hide');
      messageForm.innerHTML = !response.responseJSON ? 'Ошибка сервера' : response.responseJSON.message;
    });
}

$(function () {
  $.get('/api/users/session')
    .done(function (response) {
      $('.preloader__inner, .preloader').fadeOut();

      if (response.user) {
        mainWrap.classList.remove('hide');
        initApp(response);
      } else {
        loginWrap.classList.remove('hide');
      }
    });
});

// Save User
function initApp(response) {
  console.log(response);
  $('.user__name').text(response.user.name);
  $('.cabinet-menu__name').text(response.user.name);
  $('.cabinet-menu__span').text(response.user.email);

  if (response.user.avatar) {
    $('.cabinet-menu__avatar').css('backgroundImage', `url('${response.user.avatar}')`);
    $('.cabinet-menu__avatar').css('backgroundSize', 'cover');
  }

  const tabs = response.pages;
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].available === true) {
      setShowedForTab(tabs[i].id);
      setThemesProgress(tabs[i].id);
    }
  }

  const completedCourses = response.courses;
  galleryBtns = completedCourses;
  for (let i = 0; i < completedCourses.length; i++) {
    if (completedCourses[i].completed === true) {
      const videoBtns = $('.video__button');
      videoBtns.each(function () {
        const btn = $(this);
        const id = parseFloat($(this).attr('data-buttonid'));
        if (completedCourses[i].id === id) {
          setCompletedStyleBtn(btn);
          btn.text('Скрин отправлен!');
        }
      });
    }
  }

  const percentVideo = (100 / videoBtns.length) * completedCourses.length;
  setVideosProgress(percentVideo);

  const tasks = response.tasks;
  let completedTasks = 0;
  for (const task of tasks) {
    if (task.available === true) {
      setShowedForTask(task.id);
    }
    if (task.completed === true) {
      completedTasks++;
    }
    setTasksProgress(completedTasks, response.tasks.length);
  }

  const btnFirstTask = $('.task-screen');
  const btnSecondTask = $('.button-blue_form');

  if (completedTasks === 1) {
    setCompletedStyleBtn(btnFirstTask);
    btnFirstTask.text('Отправлено!');
  }
  if (completedTasks === 2) {
    setCompletedStyleBtn(btnFirstTask);
    setCompletedStyleBtn(btnSecondTask);
    btnFirstTask.text('Отправлено!');
    btnSecondTask.text('Отправлено!');
  }

  // const answersTheoryAttempt = Array.from(new Set(response.answers_theory_attempt))[0];
  // const answersRocketAttempt = Array.from(new Set(response.answers_rocket_attempt))[0];

  // if (response.answers_theory_false.length > 3 && answersTheoryAttempt === 3) {
  //   $('.quiz-preview__start-theory').addClass('hide');
  //   $('.quiz-preview__finished_undone-theory').removeClass('hide');
  //   $('.js-btn-next').prop('disabled', true);
  // } else if (response.answers_theory_false.length > 3 && answersTheoryAttempt < 3) {
  //   $('.quiz-result_incorrect-theory').removeClass('hide');
  //   $('.quiz-preview').addClass('hide');
  //   $('.quiz-submit-theory').addClass('hide');
  //   $('.article__wrap').css('display', 'flex');
  //   $('.js-btn-next').prop('disabled', true);
  // } else {
  //   $('.quiz-preview__start-theory').addClass('hide');
  //   $('.quiz-preview__finished_done-theory').removeClass('hide');
  //   $('.js-btn-next').prop('disabled', false);
  // }
  // if (!response.answers_theory_true.length) {
  //   $('.quiz-preview__start-theory').removeClass('hide');
  //   $('.quiz-preview__finished_done-theory').addClass('hide');
  //   $('.quiz-preview__finished_undone-theory').addClass('hide');
  //   $('.js-btn-next').prop('disabled', false);
  // }

  // if (response.answers_rocket_false.length > 3 && answersRocketAttempt === 3) {
  //   $('.quiz-preview__start-rocket').addClass('hide');
  //   $('.quiz-preview__finished_undone-rocket').removeClass('hide');
  //   $('.js-btn-next').prop('disabled', true);
  // } else if (response.answers_rocket_false.length > 3 && answersRocketAttempt < 3) {
  //   $('.quiz-result_incorrect-rocket').removeClass('hide');
  //   $('.quiz-preview').addClass('hide');
  //   $('.quiz-submit-rocket').addClass('hide');
  //   $('.article__wrap').css('display', 'flex');
  //   $('.js-btn-next').prop('disabled', true);
  // } else {
  //   $('.quiz-preview__start-rocket').addClass('hide');
  //   $('.quiz-preview__finished_done-rocket').removeClass('hide');
  //   $('.js-btn-next').prop('disabled', false);
  // }
  // if (!response.answers_rocket_true.length) {
  //   $('.quiz-preview__start-rocket').removeClass('hide');
  //   $('.quiz-preview__finished_done-rocket').addClass('hide');
  //   $('.quiz-preview__finished_undone-rocket').addClass('hide');
  //   $('.js-btn-next').prop('disabled', false);
  // }
}

// Logout user
function logout() {
  $.ajax({
    url: '/api/users/session',
    type: 'DELETE',
    success: function () {
      location.reload();
    },
  });
}

// Set User Avatar
const avatar = $('.cabinet-menu__avatar');
$('#upload-button').click(function () {
  $('#my-custom-design-upload').trigger('click');
  return false;
});

function setAvatar(e) {
  if (window.FileReader) {
    const file = e.target.files[0];
    const reader = new FileReader();
    if (file && file.type.match('image.*')) {
      reader.readAsDataURL(file);
    } else {
      avatar.css('display', 'none');
      avatar.css('backgroundImage', '');
    }
    reader.onloadend = function () {
      const urlAvatar = reader.result;
      avatar.css('backgroundImage', `url('${urlAvatar}')`);
      avatar.css('backgroundSize', 'cover');

      setUserAvatar(urlAvatar);
    };
  }
}
document.getElementById('my-custom-design-upload').addEventListener('change', setAvatar, false);

function setUserAvatar(avatar) {
  $.ajax({
    url: 'api/users/avatar',
    type: 'PUT',
    data: { avatar },
  });
}

// Tabs Menu
$('ul.menu button').each(function () {
  $(this).click(function (e) {
    hidePrivatCabinet();
    hideTaskContent();
    const li = $(this).parent();

    if (!(li.hasClass('showed'))) {
      $('.popup_access').css('display', 'flex');
    } else {
      e.stopPropagation();
      const tab = li.attr('data-tab');

      li.siblings().removeClass('open');
      li.siblings().each(function () {
        $(this).find('li').removeClass('open');
      });

      if (!tab) {
        li.toggleClass('open');
      } else {
        $('ul.menu li.active').removeClass('active');
        $('ul.tab-content li.active').removeClass('active');
        saveActiveTab(tab);
        openTab(tab);
      }
    }

    if ($(this).hasClass('submenu__button_test')) {
      $('.tab-buttons').css('display', 'none');
      $('.tab-content').css('height', '100%');
    } else {
      $('.tab-buttons').css('display', 'flex');
      $('.tab-content').css('height', 'calc(100% - 87px)');
    }
  });
});

// Local Storage Tabs Menu
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

$('ul.menu li[data-tab]').each(function () {
  $(this).click(function () {
    saveActiveTab($(this).attr('data-tab'));
  });
});

$(document).ready(() => {
  loadActiveTab();
});

// Save Themes Progress In Cabinet
const themesOneCount = [];
const themesTwoCount = [];
const themesOne = [];
const themesTwo = [];

$('ul.menu li[data-tab]').each(function () {
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

  if (percentFistTheme === 100) {
    $('.themes-count').html('1');
  }
  if (percentSecondTheme === 100) {
    $('.themes-count').html('2');
  }
}

// Prev/Next Buttons
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

    $('.tab-content__item_test.active').each(function () {
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

// Add Showed Class For Tabs
function setShowedForTab(tab) {
  let li = $(`ul.menu li[data-tab="${tab}"]`);

  while (li.is('li')) {
    li.addClass('showed');
    li = li.parent().parent();
  }
}

// Add Availible Tasks And Pages
function addAvailablePage(pageId) {
  $.ajax({
    url: 'api/users/available_pages',
    type: 'POST',
    data: { pageId },
  });
}

function addAvailableTask(taskId) {
  $.ajax({
    url: 'api/users/available_tasks',
    type: 'POST',
    data: { taskId },
  });
}

// Getting Next/Prev Tab
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
  window.addEventListener('storage', function (event) {
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

// Switching Tasks
$('.task-header').click(function () {
  const id = $(this).attr('data-task');
  const content = $('.task-content[data-task="' + id + '"]');
  const task = $(this);

  if (task.hasClass('showed')) {
    $('.task-header').addClass('hide');
    $('.task-content.active').removeClass('active');
    content.addClass('active');
  } else {
    $('.popup_access').css('display', 'flex');
    $('.popup_access .popup__title').html('Сделайте предыдущую задачу, чтобы получить доступ к следующей');
  }
});

// Hide Task In Click
$('.task-return').click(function () {
  hideTaskContent();
});

function hideTaskContent() {
  $('.task-header').removeClass('hide');
  $('.task-content.active').removeClass('active');
}

// Add Showed Class For Task
function setShowedForTask(task) {
  const li = $(`ul.tasks__headers li[data-task="${task}"]`);
  li.addClass('showed');
}

function setShowedForNextTask() {
  const taskId = $('.task-header.showed').next().attr('data-task');
  $('.task-header.showed').next().addClass('showed');
  addAvailableTask(Number(taskId));
}

// Get Screenshots Of Tasks And Videos
const fileElemTask = document.querySelector('#fileElem2');
const fileElemVideos = document.querySelector('#fileElem');
fileElemTask.addEventListener('change', previewFiles);
fileElemVideos.addEventListener('change', previewFiles);
const convertTasksImagesResults = [];
let convertVideosImagesResults = [];
function previewFiles() {
  const filesTask = document.querySelector('#fileElem2').files;
  const filesVideos = document.querySelector('#fileElem').files;
  const fileId = Number(this.dataset.screen);

  function readAndPreview(file) {
    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
      const reader = new FileReader();

      reader.addEventListener(
        'load',
        () => {
          const image = new Image();
          image.height = 100;
          image.title = file.name;
          image.src = reader.result;
          if (fileId === 2) {
            convertTasksImagesResults.push(reader.result);
          }
          if (fileId === 1) {
            convertVideosImagesResults.push(reader.result);
          }
        },
        false,
      );

      reader.readAsDataURL(file);
    }
  }

  if (filesTask) {
    Array.prototype.forEach.call(filesTask, readAndPreview);
  }
  if (filesVideos) {
    Array.prototype.forEach.call(filesVideos, readAndPreview);
  }
}

// Set styles to completed courses and tasks buttons
function setCompletedStyleBtn(btn) {
  btn.addClass('button-completed');
  btn.prop('disabled', true);
}

// Send Tasks Results To Server
function onSubmitTask(formTask) {
  const formData = new FormData(formTask);
  let taskScreens = convertTasksImagesResults;
  const taskLink = formData.get('link');
  const taskComment = formData.get('comment');
  const taskId = $(formTask).attr('data-formId');
  const btnFirstTask = $('.task-screen');
  const btnSecondTask = $('.button-blue_form');

  if (taskId === 2) {
    taskScreens = [];
  }

  $.ajax({
    url: `/api/tasks/${taskId}/results`,
    type: 'PUT',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ taskId, link: taskLink, comment: taskComment, screens: taskScreens }),
    success: function (res) {
      formTask.reset();
      showConfirmPopup();
      resetPopupShot();
      closepopupShot();
      setShowedForTask();
      setShowedForNextTask();
      setTasksProgress(res.completed_count, res.count);

      if (taskId === 1) {
        setCompletedStyleBtn(btnFirstTask);
        btnFirstTask.text('Отправлено!');
      }
      if (taskId === 2) {
        setCompletedStyleBtn(btnSecondTask);
        btnSecondTask.text('Отправлено!');
      }
    },
  });
}

// Save Tasks Progress
function setTasksProgress(completedCount, count) {
  const taskProgress = ((count / 100) * completedCount);

  if (taskProgress === 0.02) {
    $('.percent_four').html('50');
    $('.stat-block__percent_four').css('color', '#0EC1FF');
    $('.stat-line_four').css('width', '50%');
  } else if (taskProgress === 0.04) {
    $('.themes-count').html('4');
    $('.percent_four').html('100');
    $('.stat-block__percent_four').css('color', '#E04AA8');
    $('.stat-line_four').css('width', '100%');
  }
}

// Hide/Show Confirm Sending Popup
function showConfirmPopup() {
  $('.popup_confirm').css('display', 'flex');
}

function closeConfirmPopup() {
  $('.popup_confirm').css('display', 'none');
}

$('.popup__close_confirm').click(function () {
  closeConfirmPopup();
});

// Send Video Id And Screenshots To Server
const body = document.body;

$('.video__button').each(function () {
  $(this).click(function () {
    convertVideosImagesResults = [];
    showPopupShot();
    $('.file-form_video').css('display', 'flex');
    $('.file-form_task').css('display', 'none');
    const btn = $(this);
    const btnData = $(this).attr('data-buttonid');
    $('.gallery-files__button').attr('data-sendData', btnData);

    $('.gallery-files__button').click(function () {
      const btnSendData = $(this).attr('data-sendData');

      $.ajax({
        url: `/api/users/completed_courses`,
        type: 'PUT',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ screens: convertVideosImagesResults, courseId: Number(btnSendData) }),
        success: function () {
          setCompletedStyleBtn(btn);
          btn.text('Скрин отправлен!');
        },
      });
    });
  });
});

// Popup Shot And Task
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

$('.popup__close_shot').click(function () {
  resetPopupShot();
  closepopupShot();
});

$('.popup__close_access').click(function () {
  closePopupAccess();
});

// Switching Task Contents
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

  const galleryBlocks = $('.gallery-files__block');
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

$('.task-screen').click(function () {
  showPopupShot();
  showTaskContent();
});

$('.add-screenshots').click(function () {
  showScreensTask();
});

$('.gallery-files__button_task').click(function () {
  showCommentTaskContent();
});

// Set Video Progress In Cabinet
let galleryBtns = [];
const videoBtns = $('.video__button');

$('.gallery-files__button_video').click(function () {
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
  if (percentVideo === 100) {
    $('.themes-count').html('3');
  }
}

// ************************ Drag and drop ***************** //
const dropArea = document.querySelector('.drop-area');
const buttonVideo = document.querySelector('.gallery-files__btn_video');
const buttonTask = document.querySelector('.gallery-files__btn_task');
const galleryButton = document.querySelector('.gallery-files__button_video');
const buttonTaskSend = document.querySelector('.gallery-files__button_task');
const fileContent = document.querySelectorAll('.file-form__content');
const fileContentTask = document.querySelector('.file-form__content_task');
const buttonSend = document.querySelector('.gallery-files__btn_send');

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach((eventName) => {
  dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach((eventName) => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

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
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles(files);
}

function handleFiles(files) {
  files = [...files];
  files.forEach(previewFile);
}

function previewFile(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    if (dropArea.classList.contains('popup-task')) {
      if (!(buttonSend.classList.contains('hide'))) {
        buttonTaskSend.style.display = 'none';
      } else {
        buttonTaskSend.style.display = 'block';
      }
    } else {
      galleryButton.style.display = 'block';
    }

    dropArea.classList.add('open');

    const divImage = document.createElement('div');
    divImage.className = 'gallery-files__block';
    const imageTrash = document.createElement('div');
    imageTrash.className = 'gallery-files__trash';
    const img = document.createElement('img');
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

    const galleryBlocks = document.querySelectorAll('.gallery-files__block');

    for (let i = 0; i < galleryBlocks.length; i++) {
      if (galleryBlocks.length > 1) {
        $('.file-form__content_task').addClass('hide');
        $('.file-form__content_video').addClass('hide');
      }
    }
    galleryBlocks.forEach((el) => el.addEventListener('click', function () {
      this.remove();
      this.firstChild.src = '';
      $('.file-form__content_task').removeClass('hide');
      $('.file-form__content_video').removeClass('hide');
    }));
  };
}

// Timer
let time = 1800;
let intr;

function startTimer() {
  intr = setInterval(tick, 1000);
}

function tick() {
  time = time - 1;
  const mins = Math.floor(time / 60);
  let secs = time - mins * 60;
  if (mins === 0 && secs === 0) {
    $('.popup_time').css('display', 'flex');
    clearInterval(intr);
  }
  secs = secs >= 10 ? secs : '0' + secs;
  $('.timer__time').html(mins + ':' + secs);
}

// Quiz
const quizButtonTheory = document.querySelector('.quiz-submit-theory');
const quizButtonRocket = document.querySelector('.quiz-submit-rocket');
const quizResultCorrectTheory = document.querySelector('.quiz-result_correct-theory');
const quizResultCorrectRocket = document.querySelector('.quiz-result_correct-rocket');
const quizResultInorrectTheory = document.querySelector('.quiz-result_incorrect-theory');
const quizResultInorrectRocket = document.querySelector('.quiz-result_incorrect-rocket');
const quizResultFailTheory = document.querySelector('.quiz-result_fail-theory');
const quizResultFailRocket = document.querySelector('.quiz-result_fail-rocket');
const timerTime = document.querySelector('.timer__time');
const quizButtonIncorrectTheory = document.querySelector('.quiz-button_incorrect-theory');
const quizButtonIncorrectRocket = document.querySelector('.quiz-button_incorrect-rocket');
const quizButtonStart = document.querySelectorAll('.quiz-preview__button');
const articleWrapper = document.querySelectorAll('.article__wrap');
const quizTextCorrectTheory = document.querySelector('.quiz-text_correct-theory');
const quizTextCorrectRocket = document.querySelector('.quiz-text_correct-rocket');
const quizTextFailTheory = document.querySelector('.quiz-text_fail-theory');
const quizTextFailRocket = document.querySelector('.quiz-text_fail-rocket');
const qiuzPreviewWrapper = document.querySelectorAll('.quiz-preview');
const questionsTheoryQuantity = document.querySelectorAll('.quiz-questions-theory');
const questionsRocketQuantity = document.querySelectorAll('.quiz-questions-rocket');
const questionsTheory = document.querySelectorAll('.quiz-block-theory');
const questionsRocket = document.querySelectorAll('.quiz-block-rocket');
const erorMessage = document.querySelector('.popup__title_test');
const answers = document.querySelectorAll('.answer__input');
const popupTimer = document.querySelector('.popup_time');
let attempt = 0;

function startQuiz() {
  startTimer();
  articleWrapper.forEach((el) => { el.style.display = 'flex'; });
  qiuzPreviewWrapper.forEach((el) => el.classList.add('hide'));
}

function setTimer() {
  time = 1800;
  clearInterval(intr);
  timerTime.innerText = '30:00';
}

function restartTheoryQuiz() {
  $('.tab-button_next').prop('disabled', true);
  popupTimer.classList.add('hide');
  answers.forEach((el) => { el.checked = false; });
  setTimer();
  startTimer();
  quizButtonTheory.classList.remove('hide');
  quizResultInorrectTheory.classList.add('hide');
  quizResultCorrectTheory.classList.add('hide');
}

function restartRocketQuiz() {
  $('.tab-button_next').prop('disabled', true);
  popupTimer.classList.add('hide');
  answers.forEach((el) => { el.checked = false; });
  setTimer();
  startTimer();
  quizButtonRocket.classList.remove('hide');
  quizResultInorrectRocket.classList.add('hide');
  quizResultCorrectRocket.classList.add('hide');
}

quizButtonStart.forEach((el) => el.addEventListener('click', function () {
  startQuiz();
}));
quizButtonIncorrectTheory.addEventListener('click', restartTheoryQuiz);
quizButtonIncorrectRocket.addEventListener('click', restartRocketQuiz);

function showTestErrorPopup() {
  $('.popup_test').css('display', 'flex');
}

function closeTestErrorPopup() {
  $('.popup_test').css('display', 'none');
}

$('.popup__close_test').click(function () {
  closeTestErrorPopup();
});

const answerCheckedFirst = {};
const answerCheckedSecond = {};
$('.answer__input').each(function () {
  $(this).click(function () {
    const test = +$(this).parent().parent().parent().attr('data-test');
    const key = +$(this).parent().parent().attr('data-question');
    const value = +$(this).val();
    if ($(this).prop('checked')) {
      if (test === 1) {
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
            answerCheckedFirst[key].push(value); // добавляем значение
          }
        }
      } if (test === 2) {
        if (!answerCheckedSecond[key]) {
          answerCheckedSecond[key] = [value];
        } else {
          if ($(this).hasClass('answer__input_radio')) {
            answerCheckedSecond[key] = [value];
          }
          if ($(this).hasClass('answer__input_checkbox') && answerCheckedSecond[key].includes(value)) {
            answerCheckedSecond[key] = answerCheckedSecond[key].filter((n) => n !== value);
          }
          if ($(this).hasClass('answer__input_checkbox')) {
            answerCheckedSecond[key].push(value);
          }
        }
      }
    }
    if (!($(this).prop('checked'))) {
      if (test === 1) {
        answerCheckedFirst[key] = answerCheckedFirst[key].filter((n) => n !== value);
      }
      if (test === 2) {
        answerCheckedSecond[key] = answerCheckedSecond[key].filter((n) => n !== value);
      }
    }
  });
});

// Send Quiz Results
function sendAnswersTheory(idTest) {
  questionsTheoryQuantity.forEach((el) => { el.innerText = questionsTheory.length; });
  const testId = $(idTest).parent().attr('data-test');
  attempt++;

  $.ajax({
    url: `/api/tests/${testId}/result`,
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ answers: answerCheckedFirst, attempt }),
    success: function (response) {
      quizResultCorrectTheory.classList.remove('hide');
      quizButtonTheory.classList.add('hide');
      quizTextCorrectTheory.innerText = response.correctCount;
      time = 1800;
      clearInterval(intr);
      timerTime.innerText = '30:00';
    },
    error: function (response) {
      console.log(response);
      if (response.responseJSON.incorrectCount) {
        quizResultInorrectTheory.classList.remove('hide');
        quizButtonTheory.classList.add('hide');
        time = 1800;
        clearInterval(intr);
        timerTime.innerText = '30:00';
        quizTextFailTheory.innerText = questionsTheory.length - response.responseJSON.incorrectCount;
        attempt = Array.from(new Set(response.responseJSON.attemptTheory))[0];
        console.log(attempt);

        if (attempt === 3) {
          attempt = 0;
          quizButtonTheory.classList.add('hide');
          quizResultFailTheory.classList.remove('hide');
          quizResultInorrectTheory.classList.add('hide');
          setTimer();
        }
      } else {
        showTestErrorPopup();
        erorMessage.innerText = response.responseJSON.message;
      }
    },
  });
}

function sendAnswersRocket(idTest) {
  questionsRocketQuantity.forEach((el) => { el.innerText = questionsRocket.length; });
  const testId = $(idTest).parent().attr('data-test');

  $.ajax({
    url: `/api/tests/${testId}/result`,
    type: 'POST',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ answers: answerCheckedSecond }),
    success: function (response) {
      quizResultCorrectRocket.classList.remove('hide');
      quizButtonRocket.classList.add('hide');
      quizTextCorrectRocket.innerText = response.correctCount;
      time = 1800;
      clearInterval(intr);
      timerTime.innerText = '30:00';
    },
    error: function (response) {
      if (response.responseJSON.incorrectCount) {
        quizResultInorrectRocket.classList.remove('hide');
        quizButtonRocket.classList.add('hide');
        time = 1800;
        clearInterval(intr);
        timerTime.innerText = '30:00';
        quizTextFailRocket.innerText = questionsRocket.length - response.responseJSON.incorrectCount;
        attempt = Array.from(new Set(response.responseJSON.attemptRocket))[0];
        console.log(attempt);

        if (attempt === 3) {
          attempt = 0;
          quizButtonRocket.classList.add('hide');
          quizResultFailRocket.classList.remove('hide');
          quizResultInorrectRocket.classList.add('hide');
          setTimer();
        }
      } else {
        showTestErrorPopup();
        erorMessage.innerText = response.responseJSON.message;
      }
    },
  });
}

// Save Quiz Results
$('.quiz-button_correct-theory').click(function () {
  attempt = 0;
});

$('.quiz-button_correct-rocket').click(function () {
  attempt = 0;
});
