import React from 'react'

export default class PostTable extends React.Component {
    render() {
        return (
            <table>
                <thead>
                    <tr>
                        <th>Post #</th>
                        <th>Post Article</th>
                        <th>Actions</th>
                    </tr>
                </thead>
            </table>
        )
    }
}
