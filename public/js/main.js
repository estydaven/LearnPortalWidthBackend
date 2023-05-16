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
  for (let tab of tabs) {
    setShowedForTab(tab);
  }

  const tasks = user.available_tasks;
  for (let task of tasks) {
    setShowedForTask(task);
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
  
      if (!tab) {
        li.toggleClass('open');      
      } else {
        $('ul.menu li.active').removeClass('active');
        $('ul.tab-content li.active').removeClass('active');
        saveActiveTab(tab);
        openTab(tab); 
      }
    }
  });
});

// Local Storage

function saveActiveTab(tabId) {
  window.localStorage.setItem('active-tab', tabId);
}

function loadActiveTab() {
  const activeTab = localStorage.getItem('active-tab') || '1';
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

$(document).ready(() => {
  $('.js-btn-next').click(function () {
    const activeTab = localStorage.getItem('active-tab') || '1';    
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
  });
  $('.js-btn-prev').click(function () {
    const activeTab = localStorage.getItem('active-tab') || '1';    
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
  $('.private-cabinet').removeClass('hide');
  $('.cabinet-menu').removeClass('hide');
  const activeTab = localStorage.getItem('active-tab') || '1';
  const li = $(`ul.tab-content li[data-tab="${activeTab}"]`);
  li.removeClass('active');
});

function hidePrivatCabinet() {
  $('.private-cabinet').addClass('hide');
  $('.cabinet-menu').addClass('hide');
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

function onSubmitTask(formTask) {
  const formData = new FormData(formTask);
  const taskLink = formData.get('link');
  const taskComment = formData.get('comment');
  const taskId = $(formTask).attr('data-formId');

  $.ajax({
    url: `/api/tasks/${taskId}/results`,
    type: 'PUT',
    data: {taskLink, taskComment},
    success: function() {
      formTask.reset();
      showConfirmPopup();
      resetPopupShot();
      closepopupShot();
      setShowedForTask();
      setShowedForNextTask();
    }
  });
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
// TODO: Поменять цвет кнопки "Отправить скрин о просмотре" при отправке скринов

const body = document.body;

$('.video__button').each(function() {
  $(this).click(function () {
    showPopupShot();
    $('.file-form_video').css('display', 'flex');
    $('.file-form_task').css('display', 'none');
    const btnData = $(this).attr('data-buttonid');
    $('.gallery-files__button').attr('data-sendData', btnData);
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

$('.gallery-files__button_video').click(function() {
  resetPopupShot();
  closepopupShot();
});

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
  uploadFiles(files);
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

function uploadFiles(files) {
  // $.ajax({
  //   url: `/api/tasks/${taskId}/results`,
  //   type: 'PUT',
  //   data: {files},
  //   success: function() {
  //     formTask.reset();
  //   }
  // });
  let url = '';
  let xhr = new XMLHttpRequest();
  let formData = new FormData();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  formData.append('file', files);
  xhr.send(formData);
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

const answerTitle = document.querySelectorAll('.quiz__title');
const quizButton = document.querySelector('.quiz-submit');
const quizResultCorrect = document.querySelector('.quiz-result_correct');
const quizResultInorrect = document.querySelector('.quiz-result_incorrect');
const quizResultFail = document.querySelector('.quiz-result_fail');
const timerTime = document.querySelector('.timer__time');
const quizButtonIncorrect = document.querySelectorAll('.quiz-button_incorrect');
const quizButtonStart = document.querySelector('.quiz-preview__button');
const articleWrapper = document.querySelector('.article__wrap');
const quizTextCorrect = document.querySelector('.quiz-text_correct');
const quizTextFail = document.querySelector('.quiz-text_fail');
const qiuzPreviewWrapper = document.querySelector('.quiz-preview');
const questionsQuantity = document.querySelectorAll('.quiz-questions');
const questions = document.querySelectorAll('.quiz-block');
const erorMessage = document.querySelector('.popup__title_test');
const answers = document.querySelectorAll('.answer__radio');
let score = 0;
let trying = 0;

function startQuiz() {
  start_timer();
  articleWrapper.style.display = 'flex';
  qiuzPreviewWrapper.classList.add('hide');
}

function restartQuiz() {
  $('.popup_time').css('display', 'none');
  answers.forEach(el => el.checked = false);
  time = 1800;
  clearInterval(intr);
  start_timer();
  quizButton.style.display = 'block';
  quizResultInorrect.classList.add('hide');
  quizResultCorrect.classList.add('hide');
  trying++;
  
  if (trying == 3) {
    quizButton.style.display = 'none';
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

quizButtonStart.addEventListener('click', startQuiz);
quizButtonIncorrect.forEach(el => el.addEventListener('click', function () {
  restartQuiz();     
}));
// quizButtonIncorrect.addEventListener('click', function () {
//   restartQuiz();
// });

function showTestErrorPopup() {
  $('.popup_test').css('display', 'flex');
}

function closeTestErrorPopup() {
  $('.popup_test').css('display', 'none');
}

$('.popup__close_test').click(function() {
  closeTestErrorPopup();
});


function sendAnswers() {
  const answerChecked = []; 
  const checkboxChecked = []; 
  questionsQuantity.forEach(el => el.innerText = questions.length);

  answers.forEach(elem => {
    if (elem.classList.contains('answer__radio_checkbox') && elem.checked === true) {
      checkboxChecked.push(+elem.value);
    }    
    if (!(elem.classList.contains('answer__radio_checkbox'))  && elem.checked === true) {      
      answerChecked.push(+elem.value);
    }
  });

  answerChecked.unshift(checkboxChecked);

  $.ajax({
    url: `/api/tests`,
    type: 'PUT',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({ answers: answerChecked }),
    success: function(response) {
      const trueAnswers = response.trueAnswers.length;
      quizResultCorrect.classList.remove('hide');
      quizButton.style.display = 'none';
      quizTextCorrect.innerText = trueAnswers;
      time = 1800;
      clearInterval(intr);
      timerTime.innerText = '30:00';
    },
    error: function(response) {
      if (response.responseJSON.falseAnswers) {
        quizResultInorrect.classList.remove('hide');
        quizButton.style.display = 'none';
        time = 1800;
        clearInterval(intr);
        timerTime.innerText = '30:00';
        const answer = questions.length - response.responseJSON.falseAnswers.length;
        // console.log(questions.length);
        // console.log(response.responseJSON.falseAnswers);
        // console.log(answer);
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