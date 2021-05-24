import { ScriptsActionTypes } from './enums';
import { scriptsInitialState } from './initial-state';
import { Script, ScriptsAction } from './interfaces';

export const scriptsReducer = (state = scriptsInitialState, { type, payload }: ScriptsAction): Script[] => {
	const copy = state;

	switch (type) {
		case ScriptsActionTypes.SET_SCRIPTS:
			return payload;

		case ScriptsActionTypes.DELETE_EPISODE:
			return state.filter(episode => episode.chapter_number !== payload.chapterNumber);

		case ScriptsActionTypes.SET_SCENE_PARAMETER:
			const { sceneId, field, data, modifyAllScenes } = payload;

			return state.map(item => ({
				...item,
				scenes: modifyAllScenes
					? item.scenes.map(scene => ({ ...scene, [field]: data }))
					: item.scenes.map(scene => (scene.scene_id === sceneId ? { ...scene, [field]: data } : scene ))
			}));

		case ScriptsActionTypes.UPDATE_SCENE_TASKS:
			return copy.map((s:any, si:number) => {
				if( s.chapter_number !== payload.chapter_number ) return s;

				return {
					...s,
					[payload.type]: [...s[payload.type], {def: payload.data}]
				}
			});

		default:
			return state;
	}
};
