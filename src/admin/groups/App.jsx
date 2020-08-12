import React, { Fragment } from "react";
import classNames from "classnames";

import Groups, { Heading, AddOnsBlock } from "./Groups";
import styles from "./styles.pcss";

export default class App extends React.Component{
    state = {
        groups: this.props.groups,
    }

    removeGroup = id => {
        const filteredGroups = this.state.groups.filter(group => group.id !== id);
        this.setState({ groups: filteredGroups });
    }

    render() {
        const { groups } = this.state;
        return (
            <Fragment>
                <AddOnsBlock />
                <h2 style={{ marginBottom: '0'}}>{wp.i18n.__('All Add-ons', 'product-add-ons-woocommerce')}</h2>
                {groups.length > 0 ? (
                    <table
                        className={classNames(
                            "wp-list-table",
                            "widefat",
                            "fixed",
                            "striped",
                            "posts",
                            styles.table,
                        )}
                        style={{ marginBottom: "30px" }}
                    >
                        <tbody>
                        <Heading />
                        <Groups removeGroup={this.removeGroup}>{groups}</Groups>
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.empty}>{wp.i18n.__('No Groups. Add a New Group.', 'product-add-ons-woocommerce')}</div>
                )}
            </Fragment>
        )
    }
}
