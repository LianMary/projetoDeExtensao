
const calculateResult = (questions = [], answers = []) => {
	// Retornar um objeto com erro em vez de usar `res` diretamente (responsabilidade do controller)
	if (!questions && !answers) {
		return { error: 'Perguntas ou respostas não fornecidas' };
	}

	const scores = {};

	// Inicializa áreas conhecidas a partir de questions (se fornecido)
	if (Array.isArray(questions) && questions.length) {
		questions.forEach((q) => {
			if (q && q.area) scores[q.area] = scores[q.area] || 0;
		});
	}

	// Somar pontos de acordo com a resposta. Aceitamos diferentes formatos de `answers`:
	// - { questionId, value } com `questions` disponível que mapeia id->area
	// - { area, value } diretamente na resposta
	if (!Array.isArray(answers)) answers = [];

	answers.forEach((ans) => {
		if (!ans) return;
		// corrigir typo: usar `ans`, não `and`
		const question = Array.isArray(questions)
			? questions.find((q) => q && q.id === ans.questionId)
			: undefined;

		const area = question ? question.area : (ans.area || ans.questionId);
		if (!area) return;

		if (!scores[area]) scores[area] = 0;
		scores[area] += Number(ans.value || 0);
	});

	const entries = Object.entries(scores);
	if (entries.length === 0) {
		return { scores, recommendedArea: null };
	}

	const topArea = entries.reduce((max, curr) => (curr[1] > max[1] ? curr : max), entries[0]);

	return {
		scores,
		recommendedArea: topArea[0]
	};
};

export {
	calculateResult
};
