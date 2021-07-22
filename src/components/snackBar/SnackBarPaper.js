import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Snackbar } from 'react-native-paper';

export default class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            NavTitle: "",
            NavColor: "",
            visible: false,
        };
    }

    componentDidMount() {
        this.setState({
            NavTitle: this.props.title,
            NavColor: this.props.tintColor,
            visible: this.props.openSnack,
        });
    }

    _onToggleSnackBar = () => this.setState(state => ({ visible: !state.visible }));

    _onDismissSnackBar = () => this.setState({ visible: false });

    render() {
        const { visible } = this.state;

        return (
            <Snackbar
                style={{ marginHorizontal: 1, backgroundColor: 'black' }}
                visible={visible}
                onDismiss={this._onDismissSnackBar}
                action={{
                    label: 'OK',
                    textColor: 'green',
                    onPress: () => {
                        // Faça alguma coisa
                    },
                }}
                duration={7000}
                //theme={withTheme}
                //theme={{ colors: { accent: 'red'}}}
            >
                <Text style={{ fontFamily: 'Roboto_400Regular', fontSize: 14, color: 'white', fontWeight: 'bold', }}>
                    {this.state.NavTitle}

                </Text>

            </Snackbar>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        marginTop: 45,
    },
});

