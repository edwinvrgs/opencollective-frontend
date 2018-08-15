import React, { Fragment } from 'react';
import slugify from 'slugify';
import { withState } from 'recompose';

import withData from '../lib/withData';
import { addGetLoggedInUserFunction } from '../graphql/queries';

import Header from '../components/Header';
import Body from '../components/Body';
import Footer from '../components/Footer';
import OrderForm from '../components/OrderForm';
import { H1, H2, P, Span } from '../components/Text';
import StyledInput, { SubmitInput, TextInput } from '../components/StyledInput';
import { Box, Flex } from 'grid-styled';
import Container from '../components/Container';

const labelStyles = {
  color: '#aaaaaa',
  fontSize: '10px',
  is: 'label',
  letterSpacing: '0.5px',
  mb: 1,
};

const WordCountTextarea = withState('wordCount', 'setWordCount', 140)(({ wordCount, setWordCount }) => (
  <Flex flexDirection="column">
    <Flex justifyContent="space-between">
      <P {...labelStyles} for="message">A MESSAGE FOR THE COMMUNITY <Span fontWeight="200">- Optional</Span></P>
      <P {...labelStyles} is="p">{wordCount}</P>
    </Flex>
    <StyledInput
      border="1px solid #cccccc"
      borderRadius="4px"
      fontSize="14px"
      is="textarea"
      id="message"
      onChange={({ target }) => setWordCount(() => 140 - target.value.length)}
      px={2}
      py={1}
      rows={4}
    />
  </Flex>
));

class CreatePledgePage extends React.Component {
  static getInitialProps({ query = {} }) {
    return {
      name: query.name || '',
    };
  }

  state = {
    loadingUserLogin: true,
    LoggedInUser: {
      collective: {
        host: {
          id: '',
        },
      },
      memberOf: [],
    },
  }

  async componentDidMount() {
    const { getLoggedInUser } = this.props;
    try {
      const LoggedInUser = getLoggedInUser && await getLoggedInUser();
      this.setState({
        loadingUserLogin: false,
        LoggedInUser,
      });
    } catch (error) {
      this.setState({ loadingUserLogin: false });
    }
  }

  render() {
    const { loadingUserLogin, LoggedInUser } = this.state;
    const { name } = this.props;
    const collective = {
      host: {
        id: '',
      },
    };
    const order = {
      tier: {
        type: 'DONATION',
      },
    };

    return (
      <Fragment>
        <Header
          title="Make a Pledge"
          className={loadingUserLogin ? 'loading' : ''}
          LoggedInUser={LoggedInUser}
        />
        <Body>
          <Container mx="auto" px={2} py={4} maxWidth={600}>
            <H1 textAlign="left" fontWeight="200">Pledge {name ? `to '${name}'` : ''}</H1>

            <Box my={3}>
              <P color="#aaaaaa" fontSize={12}>If the cause or collective that you want to support is not yet on Open Collective, you can make a pledge.</P>
            </Box>

            <form onSubmit={this.createOrder}>
              <Box mb={3}>
                <H2 fontWeight="200" fontSize="21px" mb={3}>Pledge details</H2>

                <WordCountTextarea />
              </Box>

              <Box mb={3}>
                <H2 fontWeight="200" fontSize="21px" mb={3}>Personal details</H2>

                <P color="#aaaaaa" fontSize={12}>If you wish to be anonymous, logout and use another email address without providing any other personal details.</P>
              </Box>

              <Box mb={3}>
                <H2 fontWeight="200" fontSize="21px" mb={3}>Details of the new collective</H2>

                <Flex flexDirection={['column', null, 'row']} alignItems={[null, null, 'flex-end']}>
                  <Flex flexDirection="column" mb={3}>
                    <P {...labelStyles} for="name">NAME</P>
                    <TextInput name="name" id="name" defaultValue={name} />
                  </Flex>

                  <Flex flexDirection="column" mb={3} flex="1 1 auto" pl={[null, null, 3]}>
                    <P {...labelStyles} for="slug">COLLECTIVE URL</P>
                    <Container border="1px solid #cccccc" borderRadius="4px" py={1} px={2} display="flex" alignItems="center">
                      <Span color="#aaaaaa" fontSize="14px">https://opencollective.com/</Span>
                      <StyledInput type="text" id="slug" name="slug" defaultValue={slugify(name)} overflow="scroll" maxWidth="150px" fontSize="14px" />
                    </Container>
                  </Flex>
                </Flex>

                <Flex flexDirection="column" mb={3}>
                  <P {...labelStyles} for="website">GITHUB OR MEETUP URL - More collective types soon!</P>
                  <TextInput type="url" name="website" id="website" placeholder="https://" />
                </Flex>
              </Box>

              <Flex justifyContent="center">
                <SubmitInput value="Submit Pledge" />
              </Flex>
            </form>
          </Container>
        </Body>
        <Footer />
      </Fragment>
    );
  }
}

export { CreatePledgePage as MockCreatePledgePage };
export default withData(addGetLoggedInUserFunction(CreatePledgePage));
