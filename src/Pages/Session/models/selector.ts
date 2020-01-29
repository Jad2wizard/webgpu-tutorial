import {AppState} from '../../../Store'

export const isLoadingSelector = (state: AppState): boolean => state.sessionState.isLoading
