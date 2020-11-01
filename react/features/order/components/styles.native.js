import { createStyleSheet } from '../../base/styles';

/**
 * The styles of the React {@code Component}s of the feature language list i.e.
 * {@code LanguageList}.
 */
export default createStyleSheet({
    container: {
      flex: 1
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF'
    },
    loadingText: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    }
  });