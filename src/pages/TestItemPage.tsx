// src/pages/TestItemsPage.tsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
} from "antd";
import type { TestItem, TestItemPayload } from "../models/TestItem";
import testItemService from "../service/TestItemService";

const TestItemsPage: React.FC = () => {
  const [items, setItems] = useState<TestItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<TestItem | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await testItemService.getAll();
      setItems(data);
      setFilteredItems(data);
    } catch {
      message.error("Error cargando ítems");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openModal = (item?: TestItem) => {
    setEditingItem(item || null);
    if (item) form.setFieldsValue(item);
    else form.resetFields();
    setModalVisible(true);
  };

  const onFinish = async (values: TestItemPayload) => {
    try {
      if (editingItem) {
        await testItemService.update(editingItem.id.toString(), values);
        message.success("Ítem actualizado");
      } else {
        await testItemService.create(values);
        message.success("Ítem creado");
      }
      setModalVisible(false);
      loadItems();
    } catch {
      message.error("Error al guardar ítem");
    }
  };

  const onDelete = async (id: number) => {
    try {
      await testItemService.delete(id.toString());
      message.success("Ítem eliminado");
      loadItems();
    } catch {
      message.error("Error al eliminar ítem");
    }
  };

  const columns = [
    { title: "Descripción", dataIndex: "description", key: "description" },
    { title: "Edad Referencia (meses)", dataIndex: "referenceAgeMonths", key: "referenceAgeMonths" },
    { title: "Orden", dataIndex: "itemOrder", key: "itemOrder" },
    { title: "Dominio", dataIndex: "domainId", key: "domainId" },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: TestItem) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>Editar</Button>
          <Popconfirm
            title="¿Seguro que quieres eliminar este ítem?"
            onConfirm={() => onDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger>Eliminar</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearch(value);
    const lowerValue = value.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.description.toLowerCase().includes(lowerValue) ||
        item.domainId.toString().includes(lowerValue)
    );
    setFilteredItems(filtered);
  };

  return (
    <div style={{ padding: 24 }}>
      <Input.Search
        placeholder="Buscar por descripción o dominio"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, maxWidth: 400 }}
      />

      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Nuevo Ítem
      </Button>

      <Table
        dataSource={filteredItems}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingItem ? "Editar Ítem" : "Nuevo Ítem"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText="Guardar"
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="description" label="Descripción" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="referenceAgeMonths" label="Edad referencia (meses)" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="itemOrder" label="Orden del ítem" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="domainId" label="ID del Dominio" rules={[{ required: true }]}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TestItemsPage;
