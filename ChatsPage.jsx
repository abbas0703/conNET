import { MultiChatSocket, MultiChatWindow, useMultiChatLogic } from 'react-chat-engine-advanced'
const ChatsPage = (props) => {
    const chatProps = useMultiChatLogic(
        'beceaeca-4ce7-49a3-bca0-cffef45c2312', 
        props.user.username, 
        props.user.secret
    );
    return (
    <div style={{ height: '100vh'}}>
        <MultiChatSocket {...chatProps} />
        <MultiChatWindow {...chatProps} style = {{ height: '100%'}} />
    </div>
    )
}
export default ChatsPage