$(document).ready(function () {
  vocabListSelect = $('#vocab_list')
  let vocabData

  fetch('vocab.json', { cache: "reload" })
    .then((response) => {
      return response.json()
	  })
		.then( (data) => {
			vocabData = data
			_.forEach(vocabData, function (list) {
				vocabListSelect.append('<option value="' + list.id + '">' + list.name + '</option>')
				})
				$('#load_quiz').on('click', function () {
				loadQuiz(vocabData)
			})
		})

  function loadQuiz (vocabData) {
		vocabList = $('#vocab_list').children('option:selected').val()
		if ((vocabList != 'Choose a vocab list')) {
			quiz = $('#quiz')
			quiz.empty()
			vocab = _.find(vocabData, {'id': parseInt(vocabList)})
			vocab = _.shuffle(vocab.words)
			quiz.append('<div id="word_list"></div>')
			_.forEach(vocab, function (word) {
				definition = _.first(word.definition)
				questionAndAnswer = '<div class="row mb-4">' +
													'<div class="col-md-8">' +
													'<div class="input-group">' +
													'<div class="input-group-prepend">' +
													'<label class="input-group-text" for="word_' + word.id + '">' + definition + '</label>' +
													'</div>' +
													'<input type="text" class="form-control guess" id="word_' + word.id + '"></input>' +
													'</div>' +
													'</div>' +
													'<div classs="col-md-4" id="answer_' + word.id + '"></div>' +
													'</div></div></div>'
				$('#word_list').append(questionAndAnswer)
			})
			$('#word_list').append('<button class="button success" id="score_quiz">Check my answers!</button>')
			$('#score_quiz').on('click', function () {
				_.forEach($('.guess'), function (guess) {
					checkAnswer(guess, vocab)
				})
			})
		}
	}

	function checkAnswer (guess, vocab) {
		guessId = _.last($(guess).attr('id').split('_'))
		guessWord = $('#word_' + guessId).val().trim()
		vocabPair = _.find(vocab, {'id': parseInt(guessId) })
		definition = _.first(vocabPair.definition)
		correctWord = _.first(vocabPair.word)
		if (correctWord.toLowerCase() === guessWord.toLowerCase()) {
			resultClass = 'text-success'
			resultMessage = 'Correct'
		} else {
			resultClass = 'text-danger'
			resultMessage = 'Sorry, ' + definition + ' is ' + correctWord
		}
		$('#answer_' + guessId).empty()
		$('#answer_' + guessId).append('<p class="' + resultClass +'">' + resultMessage + '</p>')
	}
})
